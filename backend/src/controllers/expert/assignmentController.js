import Assignment from '../../models/expert/Assignment.js';
import User from '../../models/client/Client.js';

/**
 * @desc Get all assignments for logged-in expert
 * @route GET /api/expert/assignments
 * @access Private (expert only)
 */
export const getExpertAssignments = async (req, res) => {
  try {
    const expertId = req.user.id;

    const assignments = await Assignment.find({ expert: expertId })
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, assignments });
  } catch (err) {
    console.error('getExpertAssignments error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
