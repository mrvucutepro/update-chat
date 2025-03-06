import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import adminRoutes from './routes/adminRoutes';
import blockRoutes from './routes/blockRoutes';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import User from './models/Session';
import Message from './models/Message';
import { validateUser } from './utils/userValidation';
import path from 'path';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);
connectDB();
//routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/messages', messageRoutes);
app.use('/blocks', blockRoutes);
//websocket
const onlineUsers = new Set();
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins chat room khi online
    socket.on('join-chat', async ({ userId }) => {
        socket.join(userId);
        await User.findByIdAndUpdate(userId, { isOnline: true });
        io.emit('user-online', userId);
    });

    // Admin joins a specific user's chat room
    socket.on('admin-join-userchat', ({ adminId, userId }) => {
        socket.join(userId);
        console.log(`Admin ${adminId} joined user ${userId}'s chat room`);
    });
    // Admin joins the global admin chat room
    socket.on('admin-join-adminchat', ({ adminId }) => {
        socket.join('admin-room');
        console.log(`Admin ${adminId} joined the admin chat room`);
    });

    // Handle user sending a message
    socket.on('send-message', async ({ message, sender, receiver }) => {
        onlineUsers.add(sender);

        const newMessage = new Message({ message, sender, receiver });
        await newMessage.save();

        io.to(receiver).emit('receive-message', { message, sender });
        io.to('admin-room').emit(
            'update-online-users',
            Array.from(onlineUsers)
        );
    });
    //admin yêu cầu
    socket.on('get-online-users', () => {
        socket.emit('update-online-users', Array.from(onlineUsers));
    });

    // Handle admin sending a message in the admin room
    socket.on('send-admin-message', async ({ message, sender }) => {
        const newMessage = new Message({
            message,
            sender,
            receiver: 'admin-room',
        });
        await newMessage.save();
        io.to('admin-room').emit('receive-admin-message', { message, sender });
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        const user = await User.findOneAndUpdate(
            { socketId: socket.id },
            { isOnline: false }
        );
        if (user) {
            onlineUsers.delete(user._id.toString());
        }
        io.to('admin-room').emit('update-onlineusers', Array.from(onlineUsers));
    });
});

app.post('/api/validate-user', validateUser);
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
