import jwt from "jsonwebtoken";

// ✅ Verify JWT Token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified successfully:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Role-based Access Control
export const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role)
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    next();
  };
};
