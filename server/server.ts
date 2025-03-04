import express from 'express';
import cors from 'cors';
import authRoutes from './routes/routes';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
dotenv.config();

const app = express();
const server = http.createServer(app);
const users = new Map<string, string>();
app.use(cors({ credentials: true }));
app.use(express.json());

app.use('/api', authRoutes);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('🔗 User connected:', socket.id);

    socket.on('register-user', ({ username }) => {
        socket.data.username = username;
        console.log(`User registered: ${username} -> ${socket.id}`);
    });
    socket.on('send-message-client', ({ sender, text }) => {
        console.log(`Message from client: ${sender}: ${text}`);
        socket.broadcast.emit('receive-message-admin', { sender, text });
    });

    socket.on('send-message-admin', ({ sender, text }) => {
        console.log(`Message from admin: ${sender}: ${text}`);
        socket.broadcast.emit('receive-message-client', { sender, text });
    });

    socket.on('disconnect', () => {
        users.forEach((id, username) => {
            if (id === socket.id) {
                users.delete(username);
                console.log('User disconnected:', socket.id);
            }
        });
    });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
