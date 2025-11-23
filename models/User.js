import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },   // login username
  password: { type: String, required: true },                 // hashed password
  role: { type: String, enum: ["User", "Admin"], default: "User" },

  // ✅ Profile fields
  // Name is not highly sensitive, so we can store it in plain text (already validated & sanitized)
  name: { type: String },

  // ✅ Encrypted sensitive fields
  // We will encrypt email and bio using AES and store ciphertext + IVs
  emailEncrypted: { type: String },  // ciphertext (base64 or hex)
  emailIV: { type: String },         // IV used for email encryption

  bioEncrypted: { type: String },    // ciphertext (base64 or hex)
  bioIV: { type: String },           // IV used for bio encryption

  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
