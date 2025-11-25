import ClientMessage from '../models/ClientMessage.js';

// Get logged-in client messages
export const getClientMessages = async (req, res) => {
  try {
    const messages = await ClientMessage.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Create a new client message
export const createClientMessage = async (req, res) => {
  try {
    const message = await ClientMessage.create({
      user: req.user._id,
      message: req.body.message,
      service: req.body.service,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create message' });
  }
};
