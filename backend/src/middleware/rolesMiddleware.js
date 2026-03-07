export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Convert user role and allowed roles to lowercase for comparison
    const userRole = req.user.role.toLowerCase();
    const allowed = allowedRoles.map((r) => r.toLowerCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).json({
        message: 'Access forbidden: insufficient role',
        roleAttempted: req.user.role,
      });
    }

    next();
  };
};
