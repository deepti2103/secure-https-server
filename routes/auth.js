// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ===============================
// 📌 REGISTER ROUTE
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "User",
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ===============================
// 📌 LOGIN ROUTE
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for required fields
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token in HttpOnly cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
