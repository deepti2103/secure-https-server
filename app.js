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
import authRoutes from "./routes/auth.js";
import { verifyToken, verifyRole } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

// ✅ Security middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ✅ Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ CSRF setup (disabled for API testing)
app.use((req, res, next) => {
  res.locals.csrfToken = "TEST_MODE_CSRF_BYPASS";
  next();
});

// ✅ Routes
app.use("/auth", authRoutes);

// ✅ Protected JWT route
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
