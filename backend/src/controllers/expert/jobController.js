import Job from '../../models/client/Job.js';
import Proposal from '../../models/expert/Proposal.js';
import Expert from '../../models/expert/Expert.js';
import Notification from '../../models/Notification.js';
import User from '../../models/auth/User.js';

/**
 * @desc Get all approved jobs available for experts
 * @route GET /api/expert/jobs
 * @access Private (expert only)
 */
export const getAvailableJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('profile');
    if (!user || !user.profile) {
      return res.status(400).json({
        success: false,
        message: 'Expert profile not found.',
      });
    }

    const expertId = user.profile._id.toString();

    const jobs = await Job.find({ status: 'approved_for_bidding' })
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const mappedJobs = jobs.map((job) => ({
      _id: job._id,
      title: job.title || 'Untitled Job',
      description: job.description || '',
      branch: job.branch || 'General',
      category: job.category || 'General',
      pricingRange: job.pricingRange || { min: 0, max: 0 },
      deadline: job.deadline || null,
      client: job.client || null,
      hasApplied: job.applications?.some(
        (app) => app.expert.toString() === expertId
      ),
    }));

    res.json({ success: true, jobs: mappedJobs });
  } catch (err) {
    console.error('getAvailableJobs error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Get full job details for modal
 * @route GET /api/expert/jobs/:jobId
 * @access Private (expert only)
 */
export const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate('client', 'name email')
      .lean();

    if (!job || job.status !== 'approved_for_bidding') {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      job: {
        _id: job._id,
        title: job.title,
        description: job.description,
        branch: job.branch,
        category: job.category,
        pricingRange: job.pricingRange || { min: 0, max: 0 },
        deadline: job.deadline,
        requiredSkills: job.requiredSkills || [],
        client: job.client,
      },
    });
  } catch (err) {
    console.error('getJobDetails error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Expert applies for a job with proposal, quote, optional CV, and profile PDF
 * @route POST /api/expert/jobs/:jobId/apply
 * @access Private (expert only)
 */

export const applyForJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    const { proposalText, quote } = req.body;

    if (!proposalText) {
      return res
        .status(400)
        .json({ success: false, message: 'Proposal text is required.' });
    }
    if (!quote || quote <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Quote must be greater than 0.' });
    }

    // Fetch user + populate profile
    const user = await User.findById(userId).populate('profile');
    if (!user || !user.profile) {
      return res.status(400).json({
        success: false,
        message:
          'Expert profile not found. Please complete your profile before applying.',
      });
    }

    const expertProfile = user.profile;

    // Fetch job
    const job = await Job.findById(jobId).populate('client', 'name email');
    if (!job || job.status !== 'approved_for_bidding') {
      return res
        .status(404)
        .json({ success: false, message: 'Job not found or not approved.' });
    }

    // Prevent duplicate applications
    if (
      job.applications?.some(
        (app) => app.expert.toString() === expertProfile._id.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job.',
      });
    }

    // Optional CV
    let cvUrl = '';
    if (req.file) {
      cvUrl = `/uploads/cvs/${req.file.filename}`;
    }

    // Create proposal
    const proposal = new Proposal({
      job: jobId,
      expert: expertProfile._id,
      proposalText,
      quote,
      cvUrl,
      expertSnapshot: {
        name: expertProfile.name,
        phone: expertProfile.phone,
        photo: expertProfile.photo,
        specialization: expertProfile.specialization,
        bio: expertProfile.bio,
        experience: expertProfile.experience,
        education: expertProfile.education,
        certifications: expertProfile.certifications,
        portfolio: expertProfile.portfolio,
        rating: expertProfile.rating,
      },
    });

    await proposal.save();

    // Add application to job
    if (!job.applications) job.applications = [];
    job.applications.push({
      expert: expertProfile._id,
      coverLetter: proposalText,
      quote,
      appliedAt: new Date(),
      status: 'pending_client_selection',
    });
    await job.save();

    // Notify client
    const io = req.app.get('io');
    await Notification.create({
      userType: 'Client',
      userId: job.client._id,
      title: 'New Expert Application',
      message: `An expert applied to your job "${job.title}"`,
      jobId: job._id,
      read: false,
    });

    if (io) {
      io.to(`client_${job.client._id}`).emit('client:new_application', {
        jobId: job._id,
        title: job.title,
        expertId: expertProfile._id,
      });
    }

    res.json({
      success: true,
      message: 'Proposal submitted successfully.',
      proposal,
    });
  } catch (err) {
    console.error('applyForJob error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
