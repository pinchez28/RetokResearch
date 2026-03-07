import User from '../../models/auth/User.js';
import Expert from '../../models/expert/Expert.js';
import Job from '../../models/client/Job.js';
import Proposal from '../../models/expert/ExpertProposal.js';

// =======================
// 1. Get Expert Profile
// =======================
export const getExpertProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find expert profile
    const expert = await Expert.findOne({ user: userId })
      .populate('user', 'name email')
      .lean();

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found. Please complete your profile.',
      });
    }

    // Get user details
    const user = await User.findById(userId).select('name email phone').lean();

    res.status(200).json({
      success: true,
      data: {
        ...expert,
        name: user?.name || expert.name,
        email: user?.email,
        phone: user?.phone,
        // Combine user and expert data
        user: {
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
        },
      },
    });
  } catch (error) {
    console.error('Get expert profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expert profile',
    });
  }
};

// =======================
// 2. Get Expert Dashboard Stats
// =======================
export const getExpertStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Active Projects (jobs assigned and in progress)
    const activeProjects = await Job.countDocuments({
      assignedExpert: userId,
      status: { $in: ['in_progress', 'assigned', 'active'] },
    });

    // 2. Pending Proposals (submitted but not decided)
    const pendingProposals = await Proposal.countDocuments({
      expert: userId,
      status: 'pending',
    });

    // 3. Completed Jobs
    const completedJobs = await Job.countDocuments({
      assignedExpert: userId,
      status: 'completed',
    });

    // 4. Total Earnings from completed jobs
    const earningsResult = await Job.aggregate([
      {
        $match: {
          assignedExpert: userId,
          status: 'completed',
          budget: { $exists: true, $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$budget' },
        },
      },
    ]);

    const totalEarnings = earningsResult[0]?.totalEarnings || 0;

    // 5. Calculate approval rate (accepted proposals / total proposals)
    const proposalStats = await Proposal.aggregate([
      {
        $match: { expert: userId },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    let totalProposals = 0;
    let acceptedProposals = 0;

    proposalStats.forEach((stat) => {
      totalProposals += stat.count;
      if (stat._id === 'accepted') {
        acceptedProposals = stat.count;
      }
    });

    const approvalRate =
      totalProposals > 0
        ? Math.round((acceptedProposals / totalProposals) * 100)
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        activeProjects,
        pendingProposals,
        completedJobs,
        totalEarnings,
        approvalRate: `${approvalRate}%`,
        totalProposals,
        // You can add more stats as needed
      },
    });
  } catch (error) {
    console.error('Get expert stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expert stats',
    });
  }
};

// =======================
// 3. Get Expert's Submitted Proposals
// =======================
export const getExpertProposals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { expert: userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get proposals with pagination
    const proposals = await Proposal.find(query)
      .populate({
        path: 'job',
        select: 'title budget status client',
        populate: {
          path: 'client',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Proposal.countDocuments(query);

    res.status(200).json({
      success: true,
      proposals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get expert proposals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch proposals',
    });
  }
};

// =======================
// 4. Get Expert's Projects (Assigned Jobs)
// =======================
export const getExpertProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { assignedExpert: userId };
    if (status && status !== 'all') {
      query.status = status;
    } else {
      // Default to active and completed
      query.status = { $in: ['in_progress', 'assigned', 'completed', 'ready'] };
    }

    // Get projects with pagination
    const projects = await Job.find(query)
      .populate('client', 'name email')
      .select('-applications -client.phone') // Exclude sensitive data
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get expert projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};
