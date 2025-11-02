Secure HTTPS Authentication & Authorization Server — Phase 2
# Project Overview

This project implements a secure, scalable authentication and authorization system for a startup’s web application.
It supports local authentication (username/password) and Google Single Sign-On (SSO), with role-based access control (RBAC), JWT tokens, and security mechanisms such as HTTPS, CSRF protection, secure sessions, and rate limiting.

Setting Up the Repository
Prerequisites

Node.js v18 or later

MongoDB installed and running locally

NPM or Yarn

(Optional) Google Cloud account for OAuth credentials

Installation Steps

Clone the Repository

git clone https://github.com/<your-username>/secure-https-server.git
cd secure-https-server


Install Dependencies

npm install


Environment Configuration
Create a .env file in the project root:

PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/secure_server
SESSION_SECRET=mySuperSecretKey123
SSL_KEY=cert/private-key.pem
SSL_CERT=cert/certificate.pem
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://localhost:3001/auth/google/callback


Generate Self-Signed SSL Certificates (if not already present)

npm install selfsigned
node -e "import selfsigned from 'selfsigned'; import fs from 'fs'; const p = selfsigned.generate([{name:'commonName',value:'localhost'}], {days:365}); fs.mkdirSync('cert', {recursive: true}); fs.writeFileSync('cert/private-key.pem', p.private); fs.writeFileSync('cert/certificate.pem', p.cert); console.log('✅ Created self-signed SSL certs');"


Run the Server

npm run dev


You should see:

HTTPS server running securely on port 3001
Connected to MongoDB

Authentication Mechanisms
1. Local Authentication

Users can register and login using credentials.

Passwords are securely hashed with bcrypt before storage.

JWT tokens are issued upon successful login.

2. Google OAuth 2.0 (SSO)

Users can log in with Google using Passport.js and GoogleStrategy.

Upon successful authentication, a user record is created or updated in MongoDB.

3. Password Reset

Users can request a password reset using /auth/reset-password.

New passwords are hashed and stored securely.

Role-Based Access Control (RBAC)
Defined Roles

Admin — Full access to all routes and system management.

User — Limited access to their own data and shared routes.

Middleware

authenticateToken: Verifies JWTs and authenticates users.

authorizeRole: Restricts access based on role.

Example Protected Routes
Route	Access	Description
/api/user	User & Admin	General access
/api/admin	Admin only	Restricted route
/profile	Authenticated users	Profile management
JWT Implementation

# Tokens are generated using jsonwebtoken.

Stored securely in HttpOnly cookies to prevent XSS attacks.

Tokens have a limited lifespan for security.

Middleware ensures token validation before granting access.

Refresh Tokens

You can extend this with a refresh token strategy for longer sessions.

# Security Features
Feature	Implementation
HTTPS	Self-signed SSL certificates
Password Hashing	bcryptjs
Session Security	Secure, HttpOnly, and SameSite cookies
CSRF Protection	csurf middleware (temporarily bypassed for API testing)
Rate Limiting	express-rate-limit
Helmet	Adds key HTTP security headers
CORS	Restricts origin access
Session Fixation Protection	New session ID issued post-login
Testing Strategy
Manual Testing

# Test endpoints with curl or Postman:

curl -k -X POST https://localhost:3001/auth/register -H "Content-Type: application/json" -d "{\"username\":\"user1\",\"password\":\"123456\"}"
curl -k -X POST https://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"username\":\"user1\",\"password\":\"123456\"}"

# Simulated Attacks

Tested brute force prevention using rate limits.

Verified CSRF rejection when token missing.

Confirmed role-based access with JWT differences.

Lessons Learned

This project reinforced how security and usability must be balanced.
# Key takeaways:

Strong password hashing (bcrypt) ensures database leaks don’t expose credentials.

JWTs + HttpOnly cookies offer a flexible yet secure session model.

Implementing RBAC simplifies future scalability.

Setting up CSRF and rate limiting greatly strengthens server resilience.

Integrating SSO with Google enhances user experience but requires careful environment setup.

# Reflections
Authentication Method Choice

I implemented both local and Google OAuth 2.0 SSO for flexibility.
Local auth ensures independence from third-party providers, while Google SSO improves user experience and reduces password fatigue.

Access Control Structure

I used a simple two-tier RBAC model (User / Admin).
This keeps the system easy to maintain while ensuring clear separation of privileges.

Token Management Decision

JWTs are stored securely in HttpOnly cookies with a 15-minute expiry and refresh mechanism.
This balances convenience and protection against token misuse.

Security Risks & Mitigation

I implemented:

Session ID regeneration after login

CSRF middleware for form protection

Brute-force rate limiting on login

HTTPS for all requests
These measures minimize common web vulnerabilities while maintaining a smooth UX.

Testing Strategy

I verified:

Login / logout flows

Token validation / expiry

Role enforcement

Error handling for invalid credentials
Using cURL and Postman ensured realistic test coverage.

Lessons Learned

Proper JWT expiry handling prevents security holes.

RBAC middleware simplifies access control scaling.

Environment variables and .gitignore are critical for safe deployment.

