/**
 * Expert Assignment DTO
 * ----------------------
 * - Lifecycle comes solely from job.status
 * - ChatThreadId is injected externally
 * - Assignment is treated as snapshot
 */

const formatDate = (date) => (date ? date.toISOString() : null);

/**
 * @param {Object} assignment - ExpertAssignment document (job must be populated)
 * @param {Object} options - Additional info
 * @param {string|null} options.chatThreadId - Injected chat thread ID
 * @returns {Object} DTO
 */
export const mapExpertAssignmentDTO = (assignment, options = {}) => {
  const { chatThreadId = null } = options;

  const job = assignment.job;

  if (!job) {
    throw new Error('Assignment.job must be populated before mapping DTO');
  }

  return {
    assignmentId: assignment._id,
    jobId: job._id,

    // 🔑 SINGLE SOURCE OF TRUTH
    status: job.status, // includes in_review if applicable
    isActiveAssignment: ['assigned', 'in_progress', 'in_review'].includes(
      job.status,
    ),

    title: assignment.title,
    description: assignment.description,
    budget: assignment.budget,
    dueDate: formatDate(assignment.dueDate),

    client: assignment.client,

    // Work fields
    finalWorkUrl: job.finalWorkUrl || null,
    deliveredWorkAttachments: job.deliveredWorkAttachments || [],

    // 🔹 ChatThread ID injected externally
    chatThreadId,
  };
};
