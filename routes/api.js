import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.username}!`,
    user: req.user,
  });
});

router.get("/admin", authenticateToken, authorizeRole("Admin"), (req, res) => {
  res.json({
    message: `Hello Admin ${req.user.username}, you have special access.`,
    user: req.user,
  });
});

export default router;
