import { Server } from 'socket.io';

let io;

/**
 * Initialize Socket.IO server
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`Socket ${socket.id} joined project:${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

/**
 * Emit to project-specific room when payment succeeds
 */
export const emitProjectPaid = (projectId) => {
  if (io) {
    io.to(`project:${projectId}`).emit('project-paid', { projectId });
    console.log(`project-paid emitted to project:${projectId}`);
  }
};

/**
 * Emit when project is downloaded
 */
export const emitProjectDownloaded = (projectId) => {
  if (io) {
    io.to(`project:${projectId}`).emit('project-downloaded', { projectId });
  }
};
