Assignment Context

This project is Phase 1 of a multi-phase web-security series focused on building a secure web application following industry best practices.
In this phase, the goal is to:

1. Establish a secure HTTPS server using SSL certificates.

2. Apply security headers using Helmet.

3. Implement effective caching to balance security and performance.

4. Document configuration steps, reasoning, and lessons learned.

Project Overview

You are consulting for a startup that needs to secure its web application before launch.
Your task is to set up a secure backend that:
1. Encrypts all data transmissions (HTTPS)

2. Protects users with proper HTTP security headers

3. Uses cache-control strategies that improve performance without leaking sensitive data

Tech Stack

1. Node.js + Express.js

2. HTTPS with OpenSSL

3. Helmet (security headers)

4. Compression (performance)

5. Morgan (logging)

Setup Instructions
Requirements

1. Node.js installed

2. Windows (Command Prompt, PowerShell, or Git Bash)

3. OpenSSL installed

Clone and Install
git clone https://github.com/DevPatel-art/secure-https-server.git
cd secure-https-server
npm install

Generate SSL Certificates

If not already created:

mkdir cert
openssl req -x509 -newkey rsa:2048 -nodes ^
  -keyout cert/private-key.pem -out cert/certificate.pem -days 365 ^
  -subj "/C=CA/ST=Alberta/L=Calgary/O=SecureServer/OU=WebSec/CN=localhost"


This generates:

1. cert/private-key.pem

2. cert/certificate.pem

Note: The certificate is self-signed, so browsers will show a security warning in local development.

Run the Server
npm run dev   # uses nodemon
# or
npm start


Visit:

1. http://localhost:3000
 → HTTP redirector

2. https://localhost:3001
 → Secure HTTPS server

SSL Configuration

The server uses self-signed certificates generated with OpenSSL for local development.
This encrypts communication between browser and server, ensuring no data is sent in plain text.

const httpsOptions = {
  key: fs.readFileSync("cert/private-key.pem"),
  cert: fs.readFileSync("cert/certificate.pem"),
};
https.createServer(httpsOptions, app).listen(3001);


Why this method:
Using a self-signed certificate is the simplest and fastest way to test HTTPS locally before deploying to a live server.

Essential HTTP Headers (Helmet)

1. Helmet is used to set HTTP headers for better security.

2. Configured headers include:

3. CSP: Blocks unauthorized scripts & XSS attacks.

4. HSTS: Forces HTTPS only.

5. X-Frame-Options: Prevents clickjacking.

6. X-Content-Type-Options: Stops MIME sniffing.

7. Referrer-Policy: Protects referrer data.

Example code:

app.use(helmet());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.hsts({ maxAge: 15552000, includeSubDomains: true }));
app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:"],
    "connect-src": ["'self'"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
  },
}));

Testing

1. Visit https://localhost:3001/posts

2. Visit https://localhost:3001/profile

Inspect cache headers in DevTools → Network → Headers → Response Headers

Lessons Learned

1. I learned how to create SSL certificates and configure HTTPS in Express.

2. I practiced Cache-Control for pages like /posts, /profile, and /docs/security.

3. I learned how to use Helmet for adding security headers.

4. This project helped me understand how to combine encryption, caching, and headers for both security and performance.

Attributions & References

1. Express.js Documentation

2. Helmet Docs

3. OpenSSL Manual

4. MDN Web Docs – HTTP Headers