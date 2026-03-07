import { applicationClientDTO } from '../application/application.client.dto.js';

const formatDate = (date) => (date ? date.toISOString() : null);

export const jobClientDTO = (job, currentUserRole) => {
  const base = {
    _id: job._id,
    title: job.title,
    description: job.description,
    deadline: formatDate(job.deadline),
    status: job.status,
    createdAt: formatDate(job.createdAt),
    assignedAt: formatDate(job.assignedAt),
    startedAt: formatDate(job.startedAt),
    rejectionReason: job.rejectionReason || null,
    rejectedAt: formatDate(job.rejectedAt),

    // Virtuals
    canClientDownload: job.status === 'ready' || job.status === 'completed',
    downloadedAt: formatDate(job.downloadedAt),
    revisionRequestedAt: formatDate(job.revisionRequestedAt),
    paymentConfirmed: !!job.paymentConfirmed,

    // Map applications with expert snapshot
    applications: (job.applications || []).map((app) => ({
      ...applicationClientDTO(app),
      expertSnapshot: app.expert
        ? {
            _id: app.expert._id,
            name: app.expert.name,
            photo: app.expert.photo || null,
            specialization: app.expert.specialization || null,
            rating: app.expert.rating || 0,
            cvPdf: app.expert.cvPdf || null,
          }
        : null,
      quote: app.expectedPrice,
      proposalText: app.proposal,
      submittedAt: formatDate(app.appliedAt),
    })),
  };

  if (['Admin', 'Client'].includes(currentUserRole) && job.hiredExpert) {
    base.hiredExpert = {
      _id: job.hiredExpert._id,
      name: job.hiredExpert.name,
      photo: job.hiredExpert.photo || null,
      specialization: job.hiredExpert.specialization || null,
      bio: job.hiredExpert.bio || null,
      experience: job.hiredExpert.experience || 0,
      education: job.hiredExpert.education || null,
      certifications: job.hiredExpert.certifications || [],
      rating: job.hiredExpert.rating || 0,
      contactEmail: job.hiredExpert.email || null,
    };
  }

  return base;
};
