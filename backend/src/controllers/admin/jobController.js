import Job from '../../models/client/Job.js';
import Expert from '../../models/expert/Expert.js';
import Notification from '../../models/Notification.js';
import sendEmail from '../../../utils/sendEmail.js';

/**
 * @desc Admin reviews a job, sets pricing, selects experts
 * @route PUT /api/admin/jobs/:jobId/review
 * @access Private (admin only)
 */
export const reviewJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { minPrice, maxPrice } = req.body;

    // 1. Find job
    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    // 2. Update pricing and status
    job.pricingRange = { min: minPrice, max: maxPrice };
    job.status = 'approved_for_bidding';

    // 3. Match experts based on skills
    const matchedExperts = await Expert.find({
      skills: { $in: job.skillsRequired },
    });

    job.approvedExperts = matchedExperts.map((e) => e._id);

    await job.save();

    // 4. Notify matched experts (in-app + email + socket)
    const io = req.app.get('io');
    for (const ex of matchedExperts) {
      // In-app notification
      await Notification.create({
        userType: 'expert',
        userId: ex._id,
        title: 'New Job Available',
        message: `A new job "${job.title}" matches your skills.`,
        jobId: job._id,
        read: false,
      });

      // Socket.IO notification
      if (io) {
        io.to(`expert_${ex._id}`).emit('expert:new_job', {
          jobId: job._id,
          title: job.title,
          minPrice,
          maxPrice,
        });
      }

      // Email notification
      await sendEmail({
        to: ex.email,
        subject: 'New Job Matching Your Skills',
        html: `
          <h2>New Job Available</h2>
          <p><strong>Title:</strong> ${job.title}</p>
          <p><strong>Category:</strong> ${job.category}</p>
          <p>Pricing range: KES ${minPrice} - ${maxPrice}</p>
          <p><a href="https://your-frontend-domain/expert/jobs/${job._id}">View Job</a></p>
        `,
      });
    }

    res.json({
      success: true,
      message: 'Job reviewed and experts notified',
      matchedExperts,
      job,
    });
  } catch (err) {
    console.error('reviewJob error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to review job',
      error: err.message,
    });
  }
};
