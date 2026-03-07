const formatDate = (date) => (date ? date.toISOString() : null);

export const jobAdminDTO = (job) => {
  if (!job) return null;

  return {
    _id: job._id,
    title: job.title,
    description: job.description,
    status: job.status, // includes in_review
    createdAt: formatDate(job.createdAt),
    assignedAt: formatDate(job.assignedAt),
    startedAt: formatDate(job.startedAt),

    // Work fields
    finalWorkUrl: job.finalWorkUrl || null,
    downloadedAt: formatDate(job.downloadedAt),
    revisionRequestedAt: formatDate(job.revisionRequestedAt),

    client: job.client,
    hiredExpert: job.hiredExpert || null,
    applications: job.applications || [],
  };
};
