// middleware/roleMiddleware.js
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user; // from JWT middleware
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user info" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied: Insufficient role" });
      }

      next();
    } catch (err) {
      console.error("Role check error:", err);
      res.status(500).json({ message: "Server error during role verification" });
    }
  };
}

module.exports = authorizeRoles;
