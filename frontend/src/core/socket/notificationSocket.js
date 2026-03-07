// src/core/socket/notificationSocket.js
import { io } from 'socket.io-client';
import { useNotificationStore } from '@/core/store/notificationStore';

let socket = null;

export function initNotificationSocket({ role, userId } = {}) {
  if (socket) return socket;

  const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:4000';

  const notifStore = useNotificationStore();

  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected', socket.id);
    if (role && userId) {
      socket.emit('joinRoom', { role, userId });
    }
  });

  socket.on('disconnect', (reason) => {
    console.warn('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  socket.on('notification:new', (notification) => {
    notifStore.addNotification(notification);
  });

  socket.connect();
  return socket;
}

/** ✅ ADD THIS */
export function getNotificationSocket() {
  return socket;
}

export function disconnectNotificationSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log('🛑 Notification socket disconnected');
  }
}
