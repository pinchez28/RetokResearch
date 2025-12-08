import 'dotenv/config'; // if using .env
import mongoose from 'mongoose';

const { default: Job } = await import('./models/client/Job.js');
const { default: Client } = await import('./models/client/Client.js');

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('MongoDB connected');

try {
  const jobId = '69346a09913b89669d5defa2'; // your test job ID

  const job = await Job.findById(jobId)
    .populate({
      path: 'client',
      populate: { path: 'user', select: 'email' }, // populate virtual email
    })
    .lean({ virtuals: true }); // include virtuals

  console.log('Job title:', job.title);
  console.log('Client object:', job.client);
  console.log('Client email (virtual):', job.client?.email);
} catch (err) {
  console.error(err);
} finally {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}
