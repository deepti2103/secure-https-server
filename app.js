// app.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import http from "http"; // ✅ using HTTP instead of HTTPS

// Routes
import authRoutes from "./routes/auth.js";
import staticRoutes from "./routes/static.js";

// Middleware
import { verifyToken } from "./middleware/auth.js";

dotenv.config();

// Fix for ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------- Security & Middleware -------------------

// Helmet for HTTP headers
app.use(helmet());

// JSON parsing
app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend access
app.use(
  cors({
    origin: "http://localhost:3000", // change if your frontend runs elsewhere
    credentials: true,
  })
);

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySuperSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // ⚠️ HTTPS not used right now
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

// Rate limiter for login brute force prevention
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// ------------------- Routes -------------------
app.use("/auth", authRoutes);
app.use("/static", staticRoutes);

// Protected routes using JWT
app.get("/profile", verifyToken, (req, res) => {
  res.json({ profile: req.user });
});

app.get("/dashboard", verifyToken, (req, res) => {
  const features = req.user.role === "Admin" ? ["A", "B", "C"] : ["A"];
  res.json({ features });
});

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Secure Server (HTTP Mode)</h1>");
});

// ------------------- MongoDB Connection -------------------
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------- Start HTTP Server -------------------
const PORT = process.env.PORT || 3001;

http.createServer(app).listen(PORT, () => {
  console.log(`🚀 HTTP server running at http://localhost:${PORT}`);
});
