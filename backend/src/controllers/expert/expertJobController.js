import Job from '../../models/client/Job.js';
import Proposal from '../../models/expert/ExpertProposal.js';
import User from '../../models/auth/User.js';
import Expert from '../../models/expert/Expert.js'; // <--- import Expert

// =======================
// 1. Get Available Jobs (only jobs matching at least one skill)
// =======================
export const getAvailableJobs = async (req, res) => {
  try {
    const expertUser = await User.findById(req.user.id).populate('profile');
    if (!expertUser || !expertUser.profile) {
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });
    }

    const expertSkills = expertUser.profile.skills; // array of skills

    // Find approved jobs where expert has at least one matching skill
    const jobs = await Job.find({
      status: 'approved_for_bidding',
      skillsRequired: { $in: expertSkills }, // <--- any-skill match
    })
      .select('-client.email -client.phone')
      .populate('client', 'name');

    // Mark if expert already applied
    const proposals = await Proposal.find({ expert: req.user.id }).select(
      'job'
    );
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
    const job = await Job.findById(jobId).populate('client', 'name').lean();

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to load job details' });
  }
};

// =======================
// 3. Apply for Job
// =======================
export const applyForJob = async (req, res) => {
  try {
    const { proposalText, quote } = req.body;
    const expertId = req.user.id;
    const jobId = req.params.jobId;

    // Check if already applied
    const exists = await Proposal.findOne({ job: jobId, expert: expertId });
    if (exists)
      return res.status(400).json({
        success: false,
        message: 'You already submitted a proposal for this job.',
      });

    // Fetch expert profile
    const expertUser = await User.findById(expertId).populate('profile');
    if (!expertUser || !expertUser.profile)
      return res
        .status(404)
        .json({ success: false, message: 'Expert not found' });

    const expertSkills = expertUser.profile.skills;

    // Fetch job
    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    // Check if expert has at least one required skill
    const hasMatchingSkill = expertSkills.some((skill) =>
      job.skillsRequired.includes(skill)
    );
    if (!hasMatchingSkill) {
      return res.status(400).json({
        success: false,
        message: 'You do not have any required skills for this job.',
      });
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
        skills: expertUser.profile.skills || [], // include skills in snapshot
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
