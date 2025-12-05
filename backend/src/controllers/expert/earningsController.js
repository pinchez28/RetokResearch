import Job from '../../models/client/Job.js';

/**
 * @desc Get total earnings for the expert (completed applications)
 * @route GET /api/expert/earnings
 * @access Private (expert only)
 */
export const getEarnings = async (req, res) => {
  try {
    const expertId = req.user.id;

    const jobs = await Job.find({
      'applications.expert': expertId,
      'applications.status': 'completed',
    }).lean();

    let total = 0;
    jobs.forEach((job) => {
      job.applications.forEach((app) => {
        if (app.expert.toString() === expertId && app.status === 'completed') {
          total += app.quote || 0;
        }
      });
    });

    res.json({ success: true, total });
  } catch (err) {
    console.error('getEarnings error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
