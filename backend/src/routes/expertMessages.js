import express from 'express';
const router = express.Router();

// Dummy data
const dummyExpertMessages = [
  {
    id: 1,
    name: 'Dr. Brown',
    email: 'brown@example.com',
    message: 'Client needs guidance',
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Prof. Green',
    email: 'green@example.com',
    message: 'Research question received',
    createdAt: new Date(),
  },
];

// Route
router.get('/', (req, res) => {
  res.json(dummyExpertMessages);
});

export default router;
