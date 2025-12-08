import Job from '../../models/client/Job.js';
import Proposal from '../../models/expert/Proposal.js';
import User from '../../models/auth/User.js';

// =======================
// 1. Get Available Jobs
// =======================
export const getAvailableJobs = async (req, res) => {
  try {
    const expertId = req.user.expertId;

    const jobs = await Job.find({
      status: 'approved_for_bidding',
    })
      .select('-client.email -client.phone') // just in case
      .populate('client', 'name');

    // Mark if expert already applied
    const proposals = await Proposal.find({ expert: expertId }).select('job');

    const appliedJobIds = proposals.map((p) => p.job.toString());

    const formatted = jobs.map((job) => ({
      ...job.toObject(),
      hasApplied: appliedJobIds.includes(job._id.toString()),
    }));

    res.status(200).json({ success: true, jobs: formatted });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
    });
  }
};

// =======================
// 2. Get Single Job Details
// =======================
export const getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId)
      .populate('client', 'name') // Show ONLY name to experts
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load job details',
    });
  }
};

// =======================
// 3. Apply for Job
// =======================
export const applyForJob = async (req, res) => {
  try {
    const { proposalText, quote } = req.body;
    const expertId = req.user.id; // make sure authMiddleware sets req.user.id
    const jobId = req.params.jobId;

    // Check if already applied
    const exists = await Proposal.findOne({ job: jobId, expert: expertId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'You already submitted a proposal for this job.',
      });
    }

    // Fetch expert profile data
    const expertUser = await User.findById(expertId).populate('profile');
    if (!expertUser) {
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });
    }

    // Optional CV upload
    const cvUrl = req.file?.path || null;

    // Create proposal with snapshot
    const proposal = new Proposal({
      expert: expertId,
      job: jobId,
      proposalText,
      quote,
      cvUrl,
      expertSnapshot: {
        name: expertUser.profile.name,
        phone: expertUser.profile.phone,
        photo: expertUser.profile.photo,
        specialization: expertUser.profile.specialization,
        bio: expertUser.profile.bio,
        experience: expertUser.profile.experience,
        education: expertUser.profile.education,
        certifications: expertUser.profile.certifications || [],
        portfolio: expertUser.profile.portfolio || [],
        rating: expertUser.profile.rating || 0,
      },
    });

    await proposal.save();

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully.',
      proposal,
    });
  } catch (error) {
    console.error('Proposal submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit proposal',
    });
  }
};
