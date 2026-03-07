export const expertClientDTO = (snapshot = {}) => ({
  expertId: snapshot.expertId || snapshot._id || null,

  name: snapshot.name || 'Unknown',
  photo: snapshot.photo || null,
  specialization: snapshot.specialization || '—',

  bio: snapshot.bio || '—',
  experience: snapshot.experience || '0',
  education: snapshot.education || '—',

  certifications: Array.isArray(snapshot.certifications)
    ? snapshot.certifications
    : [],

  portfolio: Array.isArray(snapshot.portfolio) ? snapshot.portfolio : [],

  rating: typeof snapshot.rating === 'number' ? snapshot.rating : 0,

  // ✅ CRITICAL FIELD (fixes "CV Not Provided")
  cvPdf: snapshot.cvPdf || null,
});
