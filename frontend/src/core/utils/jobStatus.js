// core/utils/jobStatus.js
export const JOB_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  SUBMITTED: 'submitted',
  APPROVED_FOR_BIDDING: 'approved_for_bidding',
};

export const getJobRedirectPath = (job, userRole) => {
  if (!job || !job.status) {
    return userRole === 'client' ? '/client/job-tracking' : '/expert/jobs';
  }

  const { status, _id } = job;

  switch (status) {
    case JOB_STATUS.OPEN:
      return userRole === 'client'
        ? `/client/jobs/${_id}/applications`
        : `/expert/jobs/${_id}`;

    case JOB_STATUS.IN_PROGRESS:
      return userRole === 'client'
        ? `/client/projects/${_id}`
        : `/expert/projects/${_id}`;

    case JOB_STATUS.READY:
    case JOB_STATUS.COMPLETED:
      return userRole === 'client'
        ? `/client/payments/${_id}`
        : `/expert/projects/${_id}`;

    default:
      return userRole === 'client' ? '/client/job-tracking' : '/expert/jobs';
  }
};

export const canViewApplications = (job) => {
  return job?.status === JOB_STATUS.OPEN && !job?.hiredExpertId;
};
