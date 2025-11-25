import ExpertMessage from '../models/ExpertMessage.js';

export const getExpertMessages = async (req, res) => {
  try {
    const messages = await ExpertMessage.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

export const createExpertMessage = async (req, res) => {
  try {
    const message = await ExpertMessage.create({
      user: req.user._id,
      message: req.body.message,
      service: req.body.service,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create message' });
  }
};
