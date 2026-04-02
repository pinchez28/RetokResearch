import ExpertAssignment from '../../models/expert/ExpertAssignment.js';
import Job from '../../models/client/Job.js';
import Expert from '../../models/expert/Expert.js';

export const getAssignmentById = async (req, res) => {
  const assignment = await ExpertAssignment.findById(req.params.assignmentId)
    .populate('expert')
    .populate('client')
    .populate('job');

  if (!assignment) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  res.json({ success: true, assignment });
};

/**
 * @desc Admin overrides an assignment
 * @route PATCH /api/admin/assignments/:assignmentId/override
 */
export const overrideAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { newExpertId, reason } = req.body;

    // 1. Find assignment
    const assignment = await ExpertAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // 2. Get job
    const job = await Job.findById(assignment.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // 3. Optional: validate new expert
    let newExpert = null;
    if (newExpertId) {
      newExpert = await Expert.findById(newExpertId);

      if (!newExpert) {
        return res.status(404).json({
          success: false,
          message: 'New expert not found',
        });
      }
    }

    // 4. Store previous expert (for audit)
    const previousExpert = assignment.expert;

    // 5. Override logic
    assignment.expert = newExpertId || null;
    assignment.status = newExpertId ? 'assigned' : 'pending';

    // Reset workflow fields
    assignment.submittedWork = null;
    assignment.reviewStatus = null;

    // Optional: store override metadata
    assignment.override = {
      overriddenBy: req.user._id,
      reason: reason || 'No reason provided',
      previousExpert,
      overriddenAt: new Date(),
    };

    await assignment.save();

    // 6. Update job
    job.hiredExpertId = newExpertId || null;
    job.status = newExpertId ? 'assigned' : 'open';

    await job.save();

    return res.json({
      success: true,
      message: 'Assignment overridden successfully',
      assignment,
    });
  } catch (error) {
    console.error('Override Assignment Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to override assignment',
    });
  }
};
