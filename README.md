# Phase 4 – Security Testing, Threat Modeling & Ethical Considerations  
## Secure HTTPS Web Application

This document summarizes the security assessment, threat model, vulnerability testing, mitigation actions, and ethical/legal considerations for my secure HTTPS-based web application.

---

# **Part A: Threat Model**

## **1. Critical Assets Identified**
- **User authentication data**  
  - Username  
  - Password (stored as hashed values)  
  - Role (User/Admin)  
- **Profile information**  
  - Name  
  - Encrypted email  
  - Encrypted bio  
- **JWT tokens** used for authentication  
- **Session cookies**  
- **MongoDB database** containing user records  
- **HTTPS certificates** (private key + certificate)

---

## **2. Potential Threats (STRIDE Framework)**

| STRIDE Category | Threat Example | Impact | Likelihood | Risk |
|----------------|----------------|---------|-----------|-------|
| **S – Spoofing** | Fake login with stolen credentials | High | Medium | High |
| **T – Tampering** | JWT modification | High | Medium | High |
| **R – Repudiation** | User denies activity without logging | Medium | Low | Medium |
| **I – Information Disclosure** | Email or bio decryption if key leaked | High | Medium | High |
| **D – Denial of Service** | Flooding API endpoints | Medium | Medium | Medium |
| **E – Elevation of Privilege** | Normal user accessing `/api/admin` | High | Low | Medium |

---

## **3. Threat Model Diagram (DFD)**  
A full Data Flow Diagram (DFD) was created showing:

- Browser (Untrusted Zone)  
- HTTPS API Server (Trusted Zone)  
- MongoDB (Data Store Zone)  
- Trust boundaries  
- Data flows: Login, Register, Dashboard, Profile GET/POST  
- Attack vectors: XSS, JWT theft, token tampering, header injection  

*(Diagram submitted separately on Brightspace.)*

---

# 📌 **Part B: Security Testing**

Security was tested using **manual testing**, **npm audit**, and reviewing common automated scan findings (e.g., OWASP ZAP).

---

## **1. Manual Testing**

### **SQL Injection Simulation**
- Attempt:  
  `' OR '1'='1`
- Result: Login rejected with **"enter valid credentials"**.
- Meaning:  
  - Inputs are validated  
  - No injection or bypass occurred  
  - Authentication cannot be tricked by SQL-like payloads  

---

### **Cross-Site Scripting (XSS) Simulation**
- Attempt in Bio field:  
  ```html
  <script>alert("XSS")</script>

Result:

App rejected the input with:
"Bio cannot contain HTML tags"

Payload never executed

Meaning:

Client-side validation prevents script injection

Reduces XSS attack surface

## Dependency Vulnerability Scan (npm audit)
Initial audit results:
5 vulnerabilities (2 low, 1 moderate, 2 high)

Action taken:
npm audit fix

Current results after fix:
2 low severity vulnerabilities (in cookie/csurf)

Did NOT run:
npm audit fix --force
because it introduces breaking changes by installing a newer version of csurf.

## Security Header Testing
Common automated scan findings (e.g., OWASP ZAP) typically include:
* Missing CSP header
* Missing X-Frame-Options
* Missing X-Content-Type-Options
* Cookies missing HttpOnly / Secure flags
* Missing anti-CSRF tokens
* These were manually reviewed and addressed where appropriate.

## Vulnerability Fixes
Added Security Headers:
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

Enabled Helmet for Standard Protections:
app.use(helmet());

Added Content Security Policy (CSP):
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:"],
      "connect-src": ["'self'", "https://localhost:3001"],
      "object-src": ["'none'"],
      "frame-ancestors": ["'none'"],
    },
  })
);

Input Validation for XSS Mitigation:
In dashboard.js, added checks to block:
HTML tags
Unsafe characters
Script injection

## Ethical & Legal Considerations
Ethical Responsibilities:
Security testing was performed only on my own application, respecting ethical boundaries.
SQLi, XSS, and other simulated attacks were conducted in a controlled, non-malicious environment.
Sensitive data such as emails and bios are encrypted using AES before storage.

Legal Responsibilities:
Followed principles aligned with PIPEDA (Canada):
Protect personal data
Minimize exposure
Do not store plaintext sensitive information
HTTPS ensures encrypted data-in-transit.
Passwords are hashed, not stored in plaintext.
No unauthorized testing was performed on external systems.

## Tools Used
Manual testing	- SQLi, XSS, login bypass tests
npm audit	- Dependency vulnerability detection
Helmet.js	- Security headers
AES Encryption -	Protect sensitive profile fields
JWT	- Secure stateless authentication
HTTPS- 	Encrypted data transport

## Lessons Learned
Security is not a one-time task — it requires continuous testing and patching.
Even harmless-looking fields like bio can become XSS vectors if not validated.
Tools like Helmet and CSP greatly reduce common vulnerabilities.
npm audit is essential but must be used cautiously because --force can break dependencies.
Ethical and legal responsibilities are just as important as technical fixes.

