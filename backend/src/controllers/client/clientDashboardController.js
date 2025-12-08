import Job from '../../models/client/Job.js';

// GET /api/client/profile
import User from '../../models/auth/User.js';

export const getClientProfile = async (req, res) => {
  try {
    // Populate the profile document
    const user = await User.findById(req.user._id).populate('profile');

    const name = user.profile?.name || 'Client';

    res.json({ success: true, data: { id: user._id, name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/client/stats
export const getClientStats = async (req, res) => {
  try {
    const clientId = req.user._id;
    const clientJobs = await Job.find({ client: clientId });

    const active = clientJobs.filter((j) => j.status === 'In Progress').length;
    const completed = clientJobs.filter((j) => j.status === 'Completed').length;
    const pendingPayments = clientJobs.filter(
      (j) => j.status === 'Submitted'
    ).length;
    const messages = clientJobs.reduce(
      (acc, j) => acc + (j.messages?.length || 0),
      0
    );

    res.json({
      success: true,
      data: { active, completed, pendingPayments, messages },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/client/projects?page=&limit=
export const getClientProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const clientId = req.user._id;

    const total = await Job.countDocuments({ client: clientId });
    const jobs = await Job.find({ client: clientId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    res.json({
      success: true,
      data: jobs,
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
