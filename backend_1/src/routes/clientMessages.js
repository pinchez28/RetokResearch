import express from 'express';
const router = express.Router();

// Dummy data
const dummyClientMessages = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Help me with my research',
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    message: 'I need advice',
    createdAt: new Date(),
  },
];

// Route
router.get('/', (req, res) => {
  res.json(dummyClientMessages);
});

export default router;
