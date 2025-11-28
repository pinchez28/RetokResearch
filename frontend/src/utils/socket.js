import { io } from 'socket.io-client';

export const socket = io('http://localhost:4000'); // backend URL

// Join role-based room
const userId = localStorage.getItem('userId');
const role = localStorage.getItem('role'); // 'client' | 'expert' | 'admin'
socket.emit('joinRoom', { userId, role });
