// src/utils/socket.js
import { io } from 'socket.io-client';

// Use env variable or fallback
const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:4000';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'], // prefer websocket
  autoConnect: false, // connect manually
});

// Join role-based room after connecting
export const joinRoom = () => {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role'); // 'client' | 'expert' | 'admin'
  if (userId && role) {
    socket.emit('joinRoom', { userId, role });
  }
};

// Connect socket safely
export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

// Disconnect socket safely
export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};
