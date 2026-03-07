export const expertSelfDTO = (profile = {}) => ({
  name: profile.name,
  email: profile.email,
  phone: profile.phone,
  photo: profile.photo,
  specialization: profile.specialization,
  bio: profile.bio,
  experience: profile.experience,
  education: profile.education,
  certifications: profile.certifications || [],
  portfolio: profile.portfolio || [],
  rating: profile.rating || 0,
});
