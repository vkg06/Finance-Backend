export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check user exists
    if (!req.user) {
      return res.status(401).json({ msg: "Not authorized, no user found" });
    }

    // Check role exists
    if (!req.user.role) {
      return res.status(403).json({ msg: "User role not defined" });
    }

    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map((r) => r.toLowerCase());

    // Check permission
    if (!allowedRoles.includes(userRole)) {
      console.warn(`🚫 Access denied for role: ${req.user.role}`);
      return res.status(403).json({
        msg: "Access denied. Insufficient permissions",
      });
    }

    next();
  };
};