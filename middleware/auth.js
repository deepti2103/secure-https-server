// middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Middleware: verifyToken
 * - Checks JWT in cookies or headers
 * - Attaches user info to req.user if valid
 */
export const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

/**
 * Middleware: authorizeRole
 * - Allows only specific roles to access a route
 */
export const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
