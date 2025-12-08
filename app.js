import express from "express";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import csrf from "csurf";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";
import { verifyToken, verifyRole } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
// 🔐 Custom Security Headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});


// ✅ Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Security middleware
app.use(helmet());
app.use(
  cors({
    origin: "https://localhost:3001",
    credentials: true,
  })
);

// ✅ Body parsing for JSON + form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// ✅ Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,      // cookie only sent over HTTPS
      httpOnly: true,    // JS cannot access cookies
      sameSite: "none",  // allows cross-site if needed
    },
  })
);

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ CSRF setup (bypassed for now for testing)
app.use((req, res, next) => {
  res.locals.csrfToken = "TEST_MODE_CSRF_BYPASS";
  next();
});

// ✅ Routes
app.use("/auth", authRoutes);  // login/register
app.use("/api", apiRoutes);    // dashboard + profile APIs

// ✅ Protected JWT route (example)
app.get("/api/user", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// ✅ Role-based example route
app.get("/api/admin", verifyToken, verifyRole("Admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ HTTPS Setup
const port = process.env.PORT || 3001;

try {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  };

  https.createServer(options, app).listen(port, () => {
    console.log(`✅ HTTPS server running securely on port ${port}`);
  });
} catch (err) {
  console.error("❌ HTTPS Server Error:", err.message);
}
