import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';
import connectDB from './config/db';
import { Server } from 'socket.io';
import http from 'http';
import Message from './models/Message';

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', router);

// Kết nối MongoDB
connectDB();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('sendMessage', async (message) => {
        const { roomId, senderId, content, isInternal } = message;

        try {
            const newMessage = new Message({
                session_id: roomId,
                sender_id: senderId,
                message: content,
                is_internal: isInternal,
            });
            await newMessage.save();
            io.to(roomId).emit('receiveMessage', {
                senderId,
                content,
                isInternal,
                timestamp: new Date(),
            });
            console.log(`Message sent to room ${roomId}:`, {
                senderId,
                content,
            });
        } catch (error) {
            console.error('Error saving or sending message:', error);
        }
        // Sau đó gửi tin nhắn đến tất cả người dùng trong phòng
    });

    // Xử lý sự kiện khi user ngắt kết nối
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
