import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const token = Cookies.get('adminToken');
export const socket = io('http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
});
