export const expertAdminDTO = (snapshot = {}) => ({
  expertId: snapshot.expertId || null,
  name: snapshot.name || 'Unknown',
  email: snapshot.email || null,
  phone: snapshot.phone || null,
  photo: snapshot.photo || null,
  specialization: snapshot.specialization || '—',
  bio: snapshot.bio || '—',
  experience: snapshot.experience || '0',
  education: snapshot.education || '—',
  certifications: snapshot.certifications || [],
  portfolio: snapshot.portfolio || [],
  rating: snapshot.rating || 0,
});
