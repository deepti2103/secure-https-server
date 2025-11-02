// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) return res.status(401).json({ message: "Access token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

// Optional alias if other routes use 'verifyToken'
export const verifyToken = authenticateToken;
