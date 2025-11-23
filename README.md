** Secure User Profile Dashboard — Phase 3

Implementing Security Best Practices**

This project enhances a secure web application by adding a fully protected User Profile Dashboard with industry-grade security features. It implements JWT authentication, input validation, output sanitization, AES-256-CBC encryption, HTTPS, and dependency auditing, fully aligned with SAIT Phase 3 requirements.

1. Installation & Application Setup
1.1 Clone the Repository
git clone <your-repository-url>
cd secure-https-server

1.2 Install Dependencies
npm install

1.3 Configure Environment Variables

Create a .env file in the project root:

PORT=3001
MONGO_URI=your-mongodb-url
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
SSL_KEY=cert/private-key.pem
SSL_CERT=cert/certificate.pem
ENCRYPTION_KEY=12345678901234567890123456789012


ENCRYPTION_KEY must be exactly 32 characters (required for AES-256-CBC).

1.4 Start the HTTPS Server
npm run dev


Expected output:

HTTPS server running securely on port 3001
Connected to MongoDB

1.5 Access the Application
https://localhost:3001

1.6 Pages Included

register.html

login.html

dashboard.html (JWT-protected)

2. Input Validation (Client + Server)
2.1 Validation Rules
✔ Name

3–50 characters

Alphabets + spaces only

Regex:

/^[A-Za-z\s]{3,50}$/

✔ Email

Must follow RFC format

Validated with validator.isEmail()

Normalized with validator.normalizeEmail()

✔ Bio

Maximum 500 characters

No HTML tags

No JavaScript event attributes

Allowed characters:
A–Z, 0–9, spaces, . , ! ? ' " ( ) -

Regex:

[A-Za-z0-9\s.,!?'"()-]*

2.2 Client-Side Validation

Located in public/dashboard.js.
Provides instant UX feedback but does not replace server-side validation.

2.3 Server-Side Validation

Server enforces:

Regex matching

Email validation

Length limits

validator.escape()

Blocking HTML tags

Blocking event attributes (onerror, onclick, etc.)

Example server error:

{ "error": "Invalid name format" }

3. Output Encoding & Sanitization

Ensures that any stored or incoming data cannot execute as JavaScript.

Techniques Used

validator.escape() → escapes <script> to &lt;script&gt;

validator.stripLow() → removes hidden ASCII characters

Blocking:

<script>

<iframe>

<img>

on* event handlers

Result: Stored XSS attacks become impossible.

4. Encryption Techniques
4.1 AES-256-CBC Encryption (At Rest)

Sensitive fields encrypted before storing in MongoDB:

email → emailEncrypted

bio → bioEncrypted

Each field uses a unique IV (initialization vector).

Example MongoDB document:
{
  "emailEncrypted": "b38a0c9f9a...",
  "emailIV": "4ba82fc1...",
  "bioEncrypted": "c9af39bb81...",
  "bioIV": "88ecf33d..."
}


Encryption logic stored in:

utils/encryption.js

4.2 HTTPS Encryption (In Transit)

All communication uses:

An SSL certificate

Node.js HTTPS server

Protects users from:

MITM attacks

Token hijacking

Credential theft

5. Dependency Management
5.1 Manual Audit
npm audit


Expected:

found 0 vulnerabilities

5.2 GitHub Automated Auditing

Workflow file:

.github/workflows/security.yml


Runs:

npm install

npm audit

Flags vulnerabilities automatically

6. Reflection (Lessons Learned)

This phase significantly strengthened understanding of real-world security practices.

Key Takeaways

✔ Security must be layered (validation + sanitization + encryption + HTTPS)

✔ Input validation blocks harmful data early

✔ Output encoding prevents stored XSS

✔ AES-256-CBC secures sensitive information

✔ HTTPS ensures encrypted transmission

✔ Dependency auditing keeps the project safe long-term

Malicious Payloads Tested
<script>alert(1)</script>
<img src=x onerror=alert(1)>
Zero-width whitespace characters
SQL-style strings


All were successfully sanitized or blocked, demonstrating effective protection.

This assignment helped apply production-level, industry-relevant security practices.