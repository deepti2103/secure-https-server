import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import validator from "validator";
import User from "../models/User.js";
import { encrypt, decrypt } from "../utils/encryption.js";


const router = express.Router();

/**
 * -------------------------------------------
 *  GET /api/dashboard
 *  Secure route that returns basic user info
 *  (We will later extend this to show decrypted profile)
 * -------------------------------------------
 */
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.username}!`,
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      // name, email, bio will be added later when we decrypt from DB
    },
  });
});

/**
 * -------------------------------------------
 *  POST /api/profile
 *  Secure route for updating user profile
 *  - Validates inputs
 *  - Sanitizes inputs
 *  - Encrypts email & bio
 *  - Saves to MongoDB
 * -------------------------------------------
 */
/**
 * -------------------------------------------
 *  GET /api/profile
 *  Returns decrypted profile for logged-in user
 * -------------------------------------------
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Name is stored in plain text (already sanitized)
    const name = user.name || "";

    // Decrypt sensitive fields if present
    let email = "";
    let bio = "";

    if (user.emailEncrypted && user.emailIV) {
      try {
        email = decrypt(user.emailEncrypted, user.emailIV);
      } catch (err) {
        console.error("❌ Error decrypting email:", err);
      }
    }

    if (user.bioEncrypted && user.bioIV) {
      try {
        bio = decrypt(user.bioEncrypted, user.bioIV);
      } catch (err) {
        console.error("❌ Error decrypting bio:", err);
      }
    }

    return res.json({
      profile: {
        name,
        email,
        bio,
      },
    });
  } catch (err) {
    console.error("❌ Error loading profile:", err);
    return res.status(500).json({
      message: "Server error while loading profile.",
    });
  }
});

router.post("/profile", verifyToken, async (req, res) => {
  let { name, email, bio } = req.body;

  console.log("📩 Profile update request received:", {
    user: req.user.username,
    name,
    email,
    bio,
  });

  // ================================
  // 1️⃣ Normalize / trim
  // ================================
  name = typeof name === "string" ? name.trim() : "";
  email = typeof email === "string" ? email.trim() : "";
  bio = typeof bio === "string" ? bio.trim() : "";

  // ================================
  // 2️⃣ VALIDATION RULES
  // ================================

  // Name: 3–50 alphabetic characters + spaces
  const nameRegex = /^[A-Za-z\s]{3,50}$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({
      message:
        "Name must be 3–50 alphabetic characters (letters and spaces only).",
    });
  }

  // Email: standard format
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address.",
    });
  }

  // Bio: max 500 chars
  if (bio.length > 500) {
    return res.status(400).json({
      message: "Bio must be 500 characters or less.",
    });
  }

  // Bio: no HTML tags
  const htmlTagRegex = /<[^>]*>/;
  if (htmlTagRegex.test(bio)) {
    return res.status(400).json({
      message: "Bio cannot contain HTML tags.",
    });
  }

  // Bio: allow only letters, numbers, spaces, basic punctuation
  const bioAllowedRegex = /^[A-Za-z0-9\s.,!?'"()\-]*$/;
  if (!bioAllowedRegex.test(bio)) {
    return res.status(400).json({
      message:
        "Bio contains invalid characters. Use letters, numbers, spaces, and punctuation only.",
    });
  }

  // ================================
  // 3️⃣ SANITIZATION — prevent stored XSS
  // ================================
  const safeName = validator.escape(name);
  const safeEmail = validator.normalizeEmail(email);
  const safeBio = validator.escape(bio);

  const finalName = validator.stripLow(safeName);
  const finalBio = validator.stripLow(safeBio);

  // ================================
  // 4️⃣ ENCRYPT SENSITIVE FIELDS
  // ================================
  try {
    const { encryptedData: emailEncrypted, iv: emailIV } = encrypt(safeEmail);
    const { encryptedData: bioEncrypted, iv: bioIV } = encrypt(finalBio);

    // ================================
    // 5️⃣ SAVE TO DATABASE
    // ================================
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: finalName,
        emailEncrypted,
        emailIV,
        bioEncrypted,
        bioIV,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found while updating profile.",
      });
    }

    return res.json({
      message: "Profile securely updated with encryption.",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
      },
    });
  } catch (err) {
    console.error("❌ Error saving encrypted profile:", err);
    return res.status(500).json({
      message: "Server error while saving profile.",
    });
  }
});

export default router;
