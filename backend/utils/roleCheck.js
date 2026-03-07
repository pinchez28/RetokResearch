export const preventAdminSignup = (req, res, next) => {
  if (
    typeof req.body.role === 'string' &&
    req.body.role.toLowerCase() === 'admin'
  ) {
    return res
      .status(403)
      .json({ message: 'Admin cannot sign up via frontend.' });
  }
  next();
};
