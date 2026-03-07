import Job from '../../models/client/Job.js';
import Proposal from '../../models/expert/ExpertProposal.js';
import Notification from '../../models/notification/Notification.js';
import AuditLog from '../../models/admin/AuditLog.js';
import ChatThread from '../../models/chat/ChatThread.js';

// ---------------- List all proposals for a client job ----------------
export const getJobProposals = async (req, res) => {
  try {
    const { jobId } = req.params;
    const clientId = req.user.profile._id;

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.client.toString() !== clientId.toString())
      return res.status(403).json({ success: false, message: 'Forbidden' });

    const proposals = await Proposal.find({ job: jobId })
      .populate('expert', 'profile email role')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, proposals });
  } catch (err) {
    console.error('getJobProposals error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
