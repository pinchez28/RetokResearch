export const applicationClientDTO = (app) => {
  return {
    _id: app._id,
    proposalText: app.proposalText,
    quote: app.quote,
    estimatedDeliveryDays: app.estimatedDeliveryDays,
    status: app.status,
    isShortlisted: app.isShortlisted,
    submittedAt: app.submittedAt,

    expert: app.expertSnapshot
      ? {
          expertId: app.expertSnapshot.expertId,
          name: app.expertSnapshot.name,
          photo: app.expertSnapshot.photo,
          specialization: app.expertSnapshot.specialization,
        }
      : null,

    expertSnapshot: app.expertSnapshot
      ? {
          expertId: app.expertSnapshot.expertId,
          cvPdf: app.expertSnapshot.cvPdf,
        }
      : null,
  };
};
