import ChatThread from '../../models/chat/ChatThread.js';
import Job from '../../models/client/Job.js';
import { ensureChatThread } from '../../../utils/ensureChatThread.js';
import { chatThreadDTO } from '../../dtos/chat/chat.dto.js';

/* =======================================================
   GET CHAT THREAD
======================================================= */
export const getChatThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const userId = req.user._id; // string from middleware
    const role = req.user.role;

    let thread = await ChatThread.findById(threadId)
      .populate('clientUser', 'name role email')
      .populate('expertUser', 'name role email')
      .populate('adminUser', 'name role email')
      .populate('messages.sender', 'name role email')
      .populate({
        path: 'job',
        select: 'title status client hiredExpertId adminUser',
      });

    // Auto-create thread if missing
    if (!thread) {
      const job = await Job.findById(threadId);
      if (!job) {
        return res.status(404).json({ message: 'Chat thread not found' });
      }

      thread = await ensureChatThread({
        jobId: job._id,
        clientUserId: job.client,
        expertUserId: job.hiredExpertId,
        adminUserId: job.adminUser || null,
      });

      await thread.populate([
        { path: 'clientUser', select: 'name role email' },
        { path: 'expertUser', select: 'name role email' },
        { path: 'adminUser', select: 'name role email' },
        { path: 'messages.sender', select: 'name role email' },
        { path: 'job', select: 'title status' },
      ]);
    }

    // Authorization (string-safe)
    if (role !== 'Admin') {
      const hasAccess = (thread.allowedUserIds || [])
        .map((id) => id.toString())
        .includes(userId);

      if (!hasAccess) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    const dto = chatThreadDTO(thread, role, userId);
    return res.status(200).json(dto);
  } catch (err) {
    console.error('🔥 getChatThread ERROR:', err);
    return res.status(500).json({ message: 'Failed to load chat thread' });
  }
};

/* =======================================================
   SEND MESSAGE
======================================================= */
export const sendMessage = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { threadId } = req.params;
    const { content } = req.body;
    const userId = req.user._id; // string

    if (!content?.trim()) {
      return res.status(400).json({ message: 'Message content required' });
    }

    const thread = await ChatThread.findById(threadId);
    if (!thread)
      return res.status(404).json({ message: 'Chat thread not found' });

    // Authorization (string-safe)
    const isAllowed = thread.allowedUserIds
      .map((id) => id.toString())
      .includes(userId);

    if (!isAllowed) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Determine sender role (string-safe)
    let senderRole = null;

    if (thread.clientUser?.toString() === userId) senderRole = 'client';
    else if (thread.expertUser?.toString() === userId) senderRole = 'expert';
    else if (thread.adminUser?.toString() === userId) senderRole = 'admin';

    if (!senderRole) return res.status(403).json({ message: 'Invalid sender' });

    // Implicit read
    thread.messages.forEach((msg) => {
      if (
        !msg.deleted &&
        msg.sender.toString() !== userId &&
        !msg.readBy.some((r) => r.user.toString() === userId)
      ) {
        msg.readBy.push({
          user: userId,
          readAt: new Date(),
        });
      }
    });

    const message = {
      sender: {
        _id: userId,
        role: senderRole, // this is what admin should see
      },
      senderRole,
      content,
      status: senderRole === 'admin' ? 'approved' : 'pending',
      moderatedByAdmin: senderRole === 'admin',
      deleted: false,
      readBy: [],
    };

    thread.messages.push(message);
    await thread.save();

    io.to(`thread:${thread._id}`).emit('new-message', {
      threadId: thread._id.toString(),
      message,
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (err) {
    console.error('🔥 sendMessage ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =======================================================
   MODERATE MESSAGE (ADMIN ONLY)
======================================================= */
export const moderateMessage = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { threadId, messageId } = req.params;
    const { action, reason } = req.body;
    const adminId = req.user._id; // string

    const thread = await ChatThread.findById(threadId);
    if (!thread)
      return res.status(404).json({ message: 'Chat thread not found' });

    if (thread.adminUser?.toString() !== adminId)
      return res.status(403).json({ message: 'Only admin can moderate' });

    const message = thread.messages.id(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.status !== 'pending')
      return res.status(400).json({ message: 'Message already moderated' });

    if (!['approve', 'reject'].includes(action))
      return res.status(400).json({ message: 'Invalid action' });

    if (action === 'approve') {
      message.status = 'approved';
      message.rejectionReason = null;
    } else {
      message.status = 'rejected';
      message.rejectionReason = reason || 'No reason provided';
    }

    message.moderatedByAdmin = true;

    if (!message.readBy.some((r) => r.user.toString() === adminId)) {
      message.readBy.push({
        user: adminId,
        readAt: new Date(),
      });
    }

    await thread.save();

    io.to(`thread:${threadId}`).emit('message-moderated', {
      threadId,
      messageId: message._id.toString(),
      status: message.status,
      rejectionReason: message.rejectionReason || null,
    });

    res.json({ message: `Message ${message.status}`, data: message });
  } catch (err) {
    console.error('🔥 moderateMessage ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =======================================================
   SOFT DELETE MESSAGE
======================================================= */
export const softDeleteMessage = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { threadId, messageId } = req.params;
    const userId = req.user._id; // string

    const thread = await ChatThread.findById(threadId);
    if (!thread)
      return res.status(404).json({ message: 'Chat thread not found' });

    const isAllowed = thread.allowedUserIds
      .map((id) => id.toString())
      .includes(userId);

    if (!isAllowed) return res.status(403).json({ message: 'Forbidden' });

    const message = thread.messages.id(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.sender.toString() !== userId)
      return res.status(403).json({
        message: 'Only sender can delete this message',
      });

    if (message.status !== 'pending')
      return res.status(403).json({
        message: 'Cannot delete moderated messages',
      });

    message.deleted = true;
    await thread.save();

    io.to(`thread:${threadId}`).emit('message-deleted', {
      threadId,
      messageId,
    });

    res.json({ message: 'Message soft-deleted', data: message });
  } catch (err) {
    console.error('🔥 softDeleteMessage ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
