// middleware/authorizeRole.js
module.exports = function(requiredRole) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user info' });
      }
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }
      next();
    } catch (err) {
      console.error('Role check error:', err.message);
      res.status(500).json({ message: 'Server error during role check' });
    }
  };
};
