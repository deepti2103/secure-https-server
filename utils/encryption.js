import crypto from "crypto";

const algorithm = "aes-256-cbc";

// Helper to safely get the encryption key at runtime
function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error("ENCRYPTION_KEY is not set in the environment (.env).");
  }

  if (key.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be exactly 32 characters long (256-bit key)."
    );
  }

  return key;
}

/**
 * Encrypts plain text using AES-256-CBC
 * Returns: { encryptedData, iv }
 */
export function encrypt(text) {
  const key = Buffer.from(getEncryptionKey()); // get key at call time
  const iv = crypto.randomBytes(16); // 128-bit IV

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
  };
}

/**
 * Decrypts AES-256-CBC encrypted data
 * Requires: encryptedData + iv
 */
export function decrypt(encryptedData, iv) {
  const key = Buffer.from(getEncryptionKey()); // get key at call time

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
