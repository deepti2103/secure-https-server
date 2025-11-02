// routes/index.js
const express = require('express');
const router = express.Router();

/**
 * ✅ Route: /
 * Purpose: Main landing route for the secure HTTPS server
 * Cache: no-cache (always fetch fresh page)
 */
router.get('/', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.send(`
    <html>
      <head>
        <title>Secure HTTPS Server</title>
        <style>
          body {
            background: #f9fafb;
            font-family: Arial, sans-serif;
            text-align: center;
            padding-top: 50px;
          }
          h1 {
            color: #2e8b57;
          }
          h2 {
            color: #333;
          }
          p {
            color: #555;
          }
          a {
            color: #0078d7;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to the Secure HTTPS Server</h1>
        <h2>Your connection is encrypted 🔒</h2>
        <p>This page is served securely over HTTPS using an SSL certificate.</p>
        <p>Try visiting these routes:</p>
        <ul style="list-style:none; line-height:1.8;">
          <li>➡️ <a href="/api/status">/api/status</a></li>
          <li>➡️ <a href="/api/info">/api/info</a></li>
          <li>➡️ <a href="/api/data">/api/data</a></li>
          <li>➡️ <a href="/static">/static</a></li>
        </ul>
        <footer style="margin-top:50px; color:#888;">
          &copy; ${new Date().getFullYear()} Secure Server Project
        </footer>
      </body>
    </html>
  `);
});

/**
 * ✅ Route: /about
 * Purpose: Example extra route to demonstrate routing structure
 * Cache: cache for 5 minutes
 */
router.get('/about', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.send(`
    <html>
      <head><title>About Secure Server</title></head>
      <body style="font-family:Arial; text-align:center; margin-top:50px;">
        <h1>About This Project</h1>
        <p>This HTTPS server was built using Express.js and SSL/TLS certificates.</p>
        <p>It includes security headers (Helmet), cache control, and modular routes.</p>
        <a href="/">⬅ Back to Home</a>
      </body>
    </html>
  `);
});

module.exports = router;
