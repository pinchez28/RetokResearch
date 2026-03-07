import Job from '../../models/client/Job.js';
import Proposal from '../../models/expert/ExpertProposal.js';
import User from '../../models/auth/User.js';

export const submitProposal = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!req.user)
      return res.status(401).json({ success: false, message: 'Unauthorized' });

    const expertProfileId = req.user.profile?._id;
    if (!expertProfileId)
      return res
        .status(400)
        .json({ success: false, message: 'Expert profile missing' });

    const { proposalText, quote, estimatedDeliveryDays } = req.body;

    if (!proposalText || !quote)
      return res.status(400).json({
        success: false,
        message: 'Proposal text and quote are required',
      });

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'approved_for_bidding')
      return res
        .status(400)
        .json({ success: false, message: 'You cannot apply to this job' });

    const existing = await Proposal.findOne({
      job: jobId,
      expert: expertProfileId,
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: 'Already applied' });

    const expertUser = await User.findById(req.user._id).populate('profile');
    const expertSnapshot = {
      name: expertUser.profile?.name,
      phone: expertUser.profile?.phone,
      photo: expertUser.profile?.photo,
      specialization: expertUser.profile?.specialization,
      bio: expertUser.profile?.bio,
      experience: expertUser.profile?.experience,
      education: expertUser.profile?.education,
      certifications: expertUser.profile?.certifications || [],
      portfolio: expertUser.profile?.portfolio || [],
      rating: expertUser.profile?.rating || 0,
    };

    // Optional CV
    let cvUrl = null;
    if (req.file) {
      cvUrl = req.file.path.replace(/\\/g, '/'); // normalize for windows paths
    }

    const proposal = await Proposal.create({
      job: jobId,
      expert: expertProfileId,
      proposalText,
      quote,
      estimatedDeliveryDays,
      cvUrl,
      expertSnapshot,
    });

    return res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      proposal,
    });
  } catch (err) {
    console.error('submitProposal error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to submit proposal' });
  }
};

export const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');

    if (!proposal) {
      return res
        .status(404)
        .json({ success: false, message: 'Proposal not found' });
    }

    if (proposal.expert.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, proposal });
  } catch (err) {
    console.error('getProposalById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
