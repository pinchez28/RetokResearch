import Assignment from '../../models/expert/ExpertAssignment.js';
import Job from '../../models/client/Job.js';
import Expert from '../../models/expert/Expert.js';
import Notification from '../../models/notification/Notification.js';
import ChatThread from '../../models/chat/ChatThread.js';
import { createChatThreadOnHireConfirm } from '../../../utils/chatThreadUtils.js';
import { getExpertFromRequest } from '../../../utils/getExpertFromRequest.js';
import ClientProject from '../../models/client/ClientProject.js';
import GuestRequest from '../../models/guest/GuestRequest.js';

/* =======================================================
   GET ALL ASSIGNMENTS FOR LOGGED-IN EXPERT
======================================================= */
export const getExpertAssignments = async (req, res) => {
  try {
    const expert = await getExpertFromRequest(req);

    // 1️⃣ Existing assignments (already working)
    const assignments = await Assignment.find({ expert: expert._id })
      .populate('client', 'name email')
      .populate('job', 'title status dueDate')
      .sort({ createdAt: -1 });

    const formattedAssignments = assignments
      .filter((assignment) => assignment.job && assignment.client)
      .map((assignment) => ({
        _id: assignment._id,
        status: assignment.status,
        job: {
          _id: assignment.job._id,
          title: assignment.job.title,
          status: assignment.job.status,
          dueDate: assignment.job.dueDate,
        },
        client: {
          _id: assignment.client._id,
          name: assignment.client.name,
          email: assignment.client.email,
        },
        createdAt: assignment.createdAt,
      }));

    // 2️⃣ Admin-assigned GuestRequests
    const adminAssignments = await GuestRequest.find({
      assignedExpert: expert._id,
      status: 'assigned', // only active assigned requests
    })
      .populate('guest', 'name email phone')
      .sort({ createdAt: -1 });

    const formattedAdminAssignments = adminAssignments.map((req) => ({
      _id: req._id,
      status: req.status,
      job: {
        _id: req._id,
        title: req.topic,
        status: req.status,
        dueDate: req.deadline,
      },
      client: {
        _id: req.guest._id,
        name: req.guest.name,
        email: req.guest.email,
      },
      createdAt: req.createdAt,
      isAdminAssigned: true, // flag for frontend
    }));

    // 3️⃣ Combine both arrays
    const combinedAssignments = [
      ...formattedAssignments,
      ...formattedAdminAssignments,
    ];

    return res.json({ success: true, assignments: combinedAssignments });
  } catch (error) {
    console.error('getExpertAssignments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load assignments',
    });
  }
};

/* =======================================================
   GET SINGLE ASSIGNMENT DETAILS
======================================================= */
export const getExpertAssignmentDetails = async (req, res) => {
  try {
    const expert = await getExpertFromRequest(req);
    const { assignmentId } = req.params;

    /* ======================================================
       1️⃣ TRY NORMAL ASSIGNMENT
    ====================================================== */
    let assignment = await Assignment.findOne({
      _id: assignmentId,
      expert: expert._id,
    })
      .populate('client', 'name email')
      .populate('job', 'title description status dueDate');

    if (assignment && assignment.job) {
      const chatThread = await ChatThread.findOne({
        job: assignment.job._id,
      }).select('_id');

      return res.json({
        success: true,
        assignment: {
          _id: assignment._id,
          status: assignment.status,
          budget: assignment.budget || assignment.job.budget || 0,
          createdAt: assignment.createdAt,
          startedAt: assignment.startedAt || null,
          submittedAt: assignment.submittedAt || null,
          deliveryTime: assignment.deliveryTime || null,
          dueDate: assignment.dueDate || assignment.job.dueDate,
          job: {
            _id: assignment.job._id,
            title: assignment.job.title,
            description: assignment.job.description,
            status: assignment.job.status,
          },
          client: {
            _id: assignment.client._id,
            name: assignment.client.name,
            email: assignment.client.email,
          },
          chatThreadId: chatThread?._id || null,
          isAdminAssigned: false,
        },
      });
    }

    /* ======================================================
       2️⃣ TRY ADMIN-ASSIGNED GUEST REQUEST
    ====================================================== */
    const guestRequest = await GuestRequest.findOne({
      _id: assignmentId,
      assignedExpert: expert._id,
    }).populate('guest', 'name email phone');

    if (guestRequest) {
      return res.json({
        success: true,
        assignment: {
          _id: guestRequest._id,
          status: guestRequest.status,
          budget: guestRequest.price || 0,
          createdAt: guestRequest.createdAt,
          startedAt: null,
          submittedAt: null,
          deliveryTime: null,
          dueDate: guestRequest.deadline || null,
          job: {
            _id: guestRequest._id,
            title: guestRequest.topic || 'Guest Request',
            description: guestRequest.description || '',
            status: guestRequest.status,
          },
          client: {
            _id: guestRequest.guest?._id || null,
            name: guestRequest.guest?.name || guestRequest.name || 'Guest',
            email: guestRequest.guest?.email || guestRequest.email || '',
          },
          chatThreadId: null, // optional: add guest chat support later
          isAdminAssigned: true,
        },
      });
    }

    /* ======================================================
       3️⃣ NOT FOUND
    ====================================================== */
    return res.status(404).json({
      success: false,
      message: 'Assignment not found',
    });
  } catch (err) {
    console.error('getExpertAssignmentDetails error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Confirm Guest Assignment
export const confirmGuestAssignment = async (req, res) => {
  try {
    const expert = await getExpertFromRequest(req); // logged-in expert
    const request = await GuestRequest.findById(req.params.id);

    if (!request)
      return res
        .status(404)
        .json({ success: false, message: 'Request not found' });

    // Make sure this expert is assigned
    if (
      !request.assignedExpert ||
      request.assignedExpert.toString() !== expert._id.toString()
    )
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this request',
      });

    // Only confirm if status is assigned
    if (request.status !== 'assigned')
      return res
        .status(400)
        .json({ success: false, message: 'Request is not in assigned status' });

    request.status = 'in_progress';
    request.progress = 50; // update progress as desired
    request.timeline.push({
      actor: 'expert',
      message: `Started working on request`,
    });

    await request.save();

    // Optional: notify admin
    await Notification.create({
      userType: 'Admin',
      userId: request.adminId || null, // if you track admin
      title: 'Expert Started Work',
      message: `${expert.name} has started working on request: ${request.topic || 'No topic'}`,
    });

    // Populate assignedExpert before returning
    const populatedRequest = await GuestRequest.findById(request._id).populate(
      'assignedExpert',
      'name email specialization',
    );

    res.json({
      success: true,
      message: 'Assignment confirmed',
      request: populatedRequest,
    });
  } catch (err) {
    console.error('confirmGuestAssignment error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =======================================================
   CONFIRM ASSIGNMENT (assigned → in_progress)
======================================================= */
export const confirmAssignment = async (req, res) => {
  try {
    // 1️⃣ Resolve expert from auth context
    const expert = await getExpertFromRequest(req);
    if (!expert) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { assignmentId } = req.params;

    // 2️⃣ Fetch assignment (ownership check)
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      expert: expert._id,
    }).populate({
      path: 'client',
      populate: { path: 'user', select: '_id name email' },
    });

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Assignment is not in a confirmable state',
      });
    }

    if (!assignment.deliveryTime || assignment.deliveryTime <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Assignment has no delivery time set',
      });
    }

    // 3️⃣ Fetch associated job
    const job = await Job.findById(assignment.job);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: 'Associated job not found' });
    }

    if (job.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Job cannot be started in its current state',
      });
    }

    if (!job.hiredApplicationId) {
      return res.status(500).json({
        success: false,
        message: 'Job has no hired application linked',
      });
    }

    // 4️⃣ Move job → in_progress
    job.status = 'in_progress';
    job.startedAt = new Date();

    // Unlock chat for hired application
    const hiredApplication = job.applications.id(job.hiredApplicationId);
    if (!hiredApplication) {
      return res.status(500).json({
        success: false,
        message: 'Hired application not found on job',
      });
    }
    hiredApplication.messageFlowAllowed = true;

    await job.save();

    // 5️⃣ Move assignment → in_progress
    assignment.status = 'in_progress';
    assignment.startedAt = new Date();

    // 6️⃣ Update ClientProject to in_progress
    const clientProject = await ClientProject.findOne({
      assignment: assignment._id,
    });
    if (clientProject) {
      clientProject.status = 'in_progress';
      await clientProject.save();
    }

    // 7️⃣ Create chat thread if not exists
    if (!assignment.chatThreadId) {
      const chatThread = await createChatThreadOnHireConfirm({
        jobId: job._id,
        clientUserId: assignment.client.user._id,
        expertUserId: expert.user._id,
        adminUserId: job.adminUser || null,
      });
      assignment.chatThreadId = chatThread._id;
    }

    await assignment.save();

    // 8️⃣ Notify client
    await Notification.create({
      userType: 'Client',
      userId: assignment.client.user._id,
      title: 'Work Started',
      message: `Expert has started work on "${job.title}"`,
      jobId: job._id,
    });

    // 9️⃣ Response
    return res.status(200).json({
      success: true,
      message: 'Assignment confirmed and work started',
      jobStatus: job.status,
      assignmentStatus: assignment.status,
      projectStatus: clientProject?.status || null,
      chatThreadId: assignment.chatThreadId,
    });
  } catch (err) {
    console.error('[confirmAssignment]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      details: err.message,
    });
  }
};

// Submit guest work for guest assignments
export const submitGuestWork = async (req, res) => {
  try {
    const expert = await getExpertFromRequest(req);
    const { id } = req.params; // ✅ FIXED

    const guestRequest = await GuestRequest.findOne({
      _id: id,
      assignedExpert: expert._id,
    });

    if (!guestRequest) {
      return res.status(404).json({
        success: false,
        message: 'Guest request not found or you are not assigned to it',
      });
    }

    if (guestRequest.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Request is not in progress',
      });
    }

    if (req.file) {
      guestRequest.finalWorkUrl = `/uploads/finalWork/${req.file.filename}`;
    }

    guestRequest.status = 'submitted';
    guestRequest.progress = 80;
    guestRequest.submittedAt = new Date();

    guestRequest.timeline.push({
      actor: 'expert',
      message: 'Work submitted for admin review',
    });

    await guestRequest.save();

    return res.json({
      success: true,
      message: 'Work successfully submitted',
      request: guestRequest,
    });
  } catch (err) {
    console.error('submitGuestWork error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
/* =======================================================
   SUBMIT WORK + MARK JOB READY (in_progress → ready)
======================================================= */
export const submitWork = async (req, res) => {
  try {
    /* ======================================================
       1️⃣ AUTH + PARAMS
    ====================================================== */
    const expert = await getExpertFromRequest(req);
    const { assignmentId } = req.params;
    const { attachments } = req.body;

    /* ======================================================
       2️⃣ LOAD ASSIGNMENT + JOB
    ====================================================== */
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      expert: expert._id,
    })
      .populate('job')
      .populate('client');

    if (!assignment || !assignment.job) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    const job = assignment.job;

    /* ======================================================
       3️⃣ STATE GUARD
    ====================================================== */
    if (job.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Job not in progress',
      });
    }

    /* ======================================================
       4️⃣ SAVE FINAL WORK
    ====================================================== */
    if (req.file) {
      job.finalWorkUrl = `/uploads/finalWork/${req.file.filename}`;
    }

    if (Array.isArray(attachments)) {
      job.deliveredWorkAttachments.push(
        ...attachments.map((a) => ({
          name: a.name,
          url: a.url,
          uploadedAt: new Date(),
        })),
      );
    }

    /* ======================================================
       5️⃣ UPDATE JOB
    ====================================================== */
    job.status = 'ready';
    job.readyAt = new Date();
    await job.save();

    /* ======================================================
       6️⃣ UPDATE ASSIGNMENT
    ====================================================== */
    assignment.status = 'ready';
    assignment.submittedAt = new Date();
    await assignment.save();

    /* ======================================================
       7️⃣ 🔥 SYNC CLIENT PROJECT (CRITICAL FIX)
    ====================================================== */
    const project = await ClientProject.findOneAndUpdate(
      { assignment: assignment._id },
      {
        status: 'ready',
        readyAt: new Date(),
      },
      { new: true },
    );

    if (!project) {
      console.warn(
        '⚠️ ClientProject not found for assignment:',
        assignment._id.toString(),
      );
    }

    /* ======================================================
       8️⃣ NOTIFY CLIENT
    ====================================================== */
    await Notification.create({
      userType: 'Client',
      userId: job.client,
      title: 'Work Submitted',
      message: `Expert has submitted work for "${job.title}"`,
      jobId: job._id,
    });

    /* ======================================================
       9️⃣ RESPONSE
    ====================================================== */
    return res.json({
      success: true,
      message: 'Work submitted successfully',
      jobStatus: job.status,
      assignmentStatus: assignment.status,
      projectStatus: project?.status || 'unknown',
    });
  } catch (err) {
    console.error('submitWork error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      details: err.message,
    });
  }
};

/* =======================================================
   EXPERT ACKNOWLEDGES CLIENT REVISION
======================================================= */
export const acknowledgeRevision = async (req, res) => {
  try {
    const expert = await getExpertFromRequest(req);
    if (!expert) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { assignmentId } = req.params;
    const { note } = req.body;

    /* ======================================================
       1️⃣ FETCH ASSIGNMENT
    ====================================================== */
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      expert: expert._id,
    }).populate('job');

    if (!assignment || !assignment.job) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    const job = assignment.job;

    /* ======================================================
       2️⃣ STATE GUARDS
    ====================================================== */
    if (job.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Job is not in revision state',
      });
    }

    if (!job.revisionRequestedAt) {
      return res.status(400).json({
        success: false,
        message: 'No active revision request',
      });
    }

    if (assignment.revisionAcknowledgedAt) {
      return res.status(400).json({
        success: false,
        message: 'Revision already acknowledged',
      });
    }

    /* ======================================================
       3️⃣ ACKNOWLEDGE REVISION
    ====================================================== */
    assignment.revisionAcknowledgedAt = new Date();
    assignment.revisionNoteFromExpert = note || null;
    await assignment.save();

    /* ======================================================
       4️⃣ NOTIFY CLIENT
    ====================================================== */
    await Notification.create({
      userType: 'Client',
      userId: job.client,
      title: 'Revision In Progress',
      message:
        note || `Expert has acknowledged your revision for "${job.title}"`,
      jobId: job._id,
    });

    /* ======================================================
       5️⃣ NOTIFY ADMIN
    ====================================================== */
    await Notification.create({
      userType: 'Admin',
      title: 'Revision Acknowledged',
      message: `Expert acknowledged revision for job "${job.title}"`,
      jobId: job._id,
    });

    return res.json({
      success: true,
      message: 'Revision acknowledged. Work continues.',
      assignmentStatus: assignment.status,
      jobStatus: job.status,
    });
  } catch (err) {
    console.error('[expert acknowledgeRevision]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
