import Expert from '../models/expert/Expert.js';
import Client from '../models/client/Client.js';
import Assignment from '../models/expert/ExpertAssignment.js';
import ClientProject from '../models/client/ClientProject.js';
import Notification from '../models/notification/Notification.js';

/**
 * Assign a job to an expert
 */
export const assignJobToExpert = async ({
  job,
  expertUserId,
  clientUserId,
  assignedByUserId,
  quote = 0,
  deliveryTime,
  session = null,
}) => {
  if (!job || !expertUserId || !clientUserId || !assignedByUserId) {
    throw new Error('Missing parameters for job assignment');
  }

  if (!deliveryTime || Number(deliveryTime) <= 0) {
    throw new Error('Delivery time must be provided');
  }

  // Fetch expert & client profiles
  const expert = await Expert.findOne({ user: expertUserId }).session(session);
  if (!expert) throw new Error('Expert profile not found');

  const client = await Client.findOne({ user: clientUserId }).session(session);
  if (!client) throw new Error('Client profile not found');

  if (!job.hiredApplicationId)
    throw new Error('Job must have hiredApplicationId');

  /* ---------------- 1️⃣ Create Assignment ---------------- */
  const assignment = await Assignment.create(
    [
      {
        job: job._id,
        expert: expert._id,
        client: client._id,
        title: job.title,
        description: job.description,
        dueDate: job.deadline,
        status: 'assigned', // follow job.status
        budget: quote,
        deliveryTime,
      },
    ],
    { session },
  );

  /* ---------------- 2️⃣ Create Client Project ---------------- */
  const project = await ClientProject.create(
    [
      {
        client: client._id,
        expert: expert._id,
        assignment: assignment[0]._id,
        job: job._id,
        status: 'assigned', // match job.status
        isPaid: false,
        finalCost: quote, // 🔒 lock the final cost
        createdAt: new Date(),
      },
    ],
    { session },
  );

  assignment[0].project = project[0]._id;
  await assignment[0].save({ session });

  /* ---------------- 3️⃣ Update Job ---------------- */
  job.hiredExpertId = expert._id;
  job.status = 'assigned'; // client hired, waiting for expert confirmation
  job.assignedAt = new Date();
  job.assignedBy = assignedByUserId;
  await job.save({ session });

  /* ---------------- 4️⃣ Notifications ---------------- */
  await Notification.create(
    [
      {
        userType: 'Expert',
        userId: expertUserId,
        title: `New Job Assigned: ${job.title}`,
        message: `You have been assigned to "${job.title}". Please confirm to begin.`,
        jobId: job._id,
      },
      {
        userType: 'Client',
        userId: clientUserId,
        title: `Expert Assigned: ${job.title}`,
        message: `${expert.name || 'An expert'} has been assigned to your job.`,
        jobId: job._id,
      },
    ],
    { session },
  );

  return { assignment: assignment[0], project: project[0] };
};
