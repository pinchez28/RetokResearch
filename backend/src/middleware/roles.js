export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Make sure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access forbidden: insufficient role',
        roleAttempted: req.user.role, // optional: for debugging
      });
    }

    // Role is allowed, proceed
    next();
  };
};
