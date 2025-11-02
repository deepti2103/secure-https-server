// routes/static.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ✅ Route: /static
 * Purpose: Serve static assets (HTML, CSS, JS, images) securely
 * Cache: HTML files – no cache | Other assets – cache for 7 days
 */
router.use(
  express.static(path.join(__dirname, "../public"), {
    maxAge: "7d", // Cache static assets for 7 days
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        // Prevent caching of HTML pages
        res.setHeader("Cache-Control", "no-cache");
      } else {
        // Cache other static files (CSS, JS, images)
        res.setHeader(
          "Cache-Control",
          "public, max-age=604800, immutable"
        );
      }
    },
  })
);

/**
 * ✅ Optional route: fallback message if no files are found
 */
router.get("/", (req, res) => {
  res.send(
    `<h1>Static File Server</h1><p>Place your static files in the <strong>public/</strong> folder to access them here.</p>`
  );
});

export default router;
