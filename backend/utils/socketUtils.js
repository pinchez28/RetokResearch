let ioInstance = null;

/**
 * Initialize socket.io instance
 * Call this in server.js after creating the HTTP server
 * @param {import('socket.io').Server} io
 */
export const initSocket = (io) => {
  ioInstance = io;
};

/**
 * Emit an event to all clients in a room (threadId)
 * @param {string} room
 * @param {string} event
 * @param {any} data
 */
export const emitToSocket = (room, event, data) => {
  if (!ioInstance) {
    console.warn('Socket.io not initialized yet');
    return;
  }
  ioInstance.to(room).emit(event, data);
};
