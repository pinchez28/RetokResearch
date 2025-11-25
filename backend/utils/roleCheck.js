export const preventAdminSignup = (req, res, next) => {
  if (req.body.role === 'admin') {
    return res
      .status(403)
      .json({ message: 'Admin cannot sign up via frontend.' });
  }
  next();
};
