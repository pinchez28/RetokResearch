import Proposal from '../../models/expert/ExpertProposal.js';
import Assignment from '../../models/expert/ExpertAssignment.js';

export const getExpertStats = async (req, res) => {
  try {
    const expertId = req.user._id;

    const [
      totalProposals,
      acceptedProposals,
      activeAssignments,
      completedAssignments,
    ] = await Promise.all([
      Proposal.countDocuments({ expert: expertId }),
      Proposal.countDocuments({
        expert: expertId,
        status: 'accepted',
      }),
      Assignment.countDocuments({
        expert: expertId,
        status: 'in_progress',
      }),
      Assignment.countDocuments({
        expert: expertId,
        status: 'completed',
      }),
    ]);

    res.status(200).json({
      totalProposals,
      acceptedProposals,
      activeAssignments,
      completedAssignments,
    });
  } catch (error) {
    console.error('Expert stats error:', error);
    res.status(500).json({ message: 'Failed to fetch expert stats' });
  }
};
