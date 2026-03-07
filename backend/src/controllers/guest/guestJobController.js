import Job from '../../models/client/Job.js';

/**
 * @desc Get all approved jobs for homepage
 * @route GET /api/guest/jobs/approved
 * @access Public
 */
export const getApprovedJobs = async (req, res) => {
  try {
    // Fetch jobs approved by admin
    const jobs = await Job.find({ status: 'approved_for_bidding' })
      .populate('client', 'name email') // optional: include client name/email
      .sort({ createdAt: -1 }) // latest jobs first
      .lean();

    res.json({ success: true, data: jobs });
  } catch (err) {
    console.error('getApprovedJobs error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved jobs',
      error: err.message,
    });
  }
};
