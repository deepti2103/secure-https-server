// app.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import rateLimit from "express-rate-limit";
import http from "http";

import authRoutes from "./routes/auth.js";
import staticRoutes from "./routes/static.js";
import { verifyToken } from "./middleware/auth.js";

// ===== Load environment variables =====
dotenv.config();
const app = express();

// ===== Basic Middleware =====
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Allow frontend requests (adjust origin if needed)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ===== Session Management =====
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // HTTPS not used locally
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

// ===== Rate Limiting =====
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// ===== Database Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===== Routes =====
app.use("/auth", authRoutes);
app.use("/static", staticRoutes);

// ===== Protected Routes =====
app.get("/profile", verifyToken, (req, res) => {
  res.json({ profile: req.user });
});

app.get("/dashboard", verifyToken, (req, res) => {
  const features =
    req.user.role === "Admin"
      ? ["Manage Users", "View Logs", "Access Settings"]
      : ["View Profile", "Edit Info"];
  res.json({ features });
});

// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("<h2>Secure HTTP Server Running Successfully</h2>");
});

// ===== Server Setup (HTTP Only) =====
const PORT = process.env.PORT || 3001;

http.createServer(app).listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});
