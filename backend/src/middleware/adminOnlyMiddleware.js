export const adminOnly = (req, res, next) => {
  console.log(req.user);
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};
