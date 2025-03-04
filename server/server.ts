import express from 'express';
import cors from 'cors';
import authRoutes from './routes/routes';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
io.on('connection', (socket) => {
    socket.on('register-user', ({ username }) => {
        console.log(`User registered: ${username} -> ${socket.id}`);
    });
    socket.on('send-message-client', ({ sender, text }) => {
        io.emit('receive-message-admin', { sender, text });
    });

    socket.on('send-message-admin', ({ sender, text }) => {
        io.emit('receive-message-client', { sender, text });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
