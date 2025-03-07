import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

// Tạo kết nối Socket.IO
const socket = io(SOCKET_URL, {
    autoConnect: false,
});

export default socket;
