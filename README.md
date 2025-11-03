# Secure HTTPS Server – Complete README

A secure HTTPS-based Node.js server that implements user authentication, role-based access control, and protected API routes using **JWT**, **Express**, and **MongoDB**.
This documentation provides complete setup, configuration, and testing instructions.

---

## **1. Project Overview**

This project demonstrates secure authentication and authorization using modern best practices:

* **HTTPS** for encrypted communication
* **JWT-based authentication**
* **Role-based access (Admin/User)**
* **Security middlewares (Helmet, CSRF, CORS)**
* **MongoDB with Mongoose**

---

## **2. Technology Stack**

* **Node.js** – Backend runtime
* **Express.js** – Web framework
* **Mongoose** – MongoDB ORM
* **bcrypt** – Password hashing
* **jsonwebtoken** – Token-based authentication
* **helmet** – HTTP security headers
* **csurf** – CSRF protection
* **dotenv** – Environment configuration
* **cookie-parser** – Secure cookie handling
* **HTTPS** – TLS encryption using self-signed certificates

---

## **3. Environment Variables**

Create a `.env` file in your project root with the following content:

```bash
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/secure_server
SESSION_SECRET=mySuperSecretKey123
JWT_SECRET=mySuperStrongSecretKey
SSL_KEY=cert/private-key.pem
SSL_CERT=cert/certificate.pem
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://localhost:3001/auth/google/callback
```

---

## **4. Installation and Setup**

### **4.1 Install Dependencies**

```bash
npm install
```

### **4.2 Start the Server**

```bash
npx nodemon app.js
```

### **4.3 Ensure MongoDB is Running**

Check that MongoDB is active locally at:

```
mongodb://127.0.0.1:27017
```

### **4.4 Generate HTTPS Certificates**

If you don’t have the files:

```
cert/private-key.pem
cert/certificate.pem
```

Generate them using **OpenSSL**:

```bash
openssl req -nodes -new -x509 -keyout private-key.pem -out certificate.pem
```

Then place them in the `cert/` folder.

---

## **5. API Endpoints**

#1 – Register a New User or Admin

Endpoint:
POST /auth/register
Access: Public
Description: Creates a new user or admin account.
STEP 1 — Register a Normal User
curl -X POST "http://localhost:3001/auth/register" -H "Content-Type: application/json" -d "{\"username\":\"bob\",\"password\":\"1234\",\"role\":\"User\"}"
STEP 2 — Register an Admin User
curl -X POST "http://localhost:3001/auth/register" -H "Content-Type: application/json" -d "{\"username\":\"admin1\",\"password\":\"adminpass\",\"role\":\"Admin\"}"


 STEP 3 — Login as bob
 curl -X POST "http://localhost:3001/auth/login" -H "Content-Type: application/json" -d "{\"username\":\"bob\",\"password\":\"1234\"}"

STEP 4 — Access /profile as bob

curl -X GET "http://localhost:3001/profile" -H "Authorization: Bearer <your_token_here>"


STEP 5 — Access /dashboard as bob
curl -X GET "http://localhost:3001/dashboard" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDdlOTY1YzgxNTY2MjFhY2Q2NzIyMCIsInVzZXJuYW1lIjoiYm9iIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE3NjIxMjkzMzEsImV4cCI6MTc2MjEzMjkzMX0.1S5fHfVRREN9J0Rpd3quNVPE58AANv_KypeSy2ZZNKA"

STEP 6 — Login as admin1
curl -X POST "http://localhost:3001/auth/login" -H "Content-Type: application/json" -d "{\"username\":\"admin1\",\"password\":\"adminpass\"}"

STEP 7 — Access /dashboard as Admin
curl -X GET "http://localhost:3001/dashboard" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDdmMmM5MDhiZWVhMzRlZGM5OTA4NCIsInVzZXJuYW1lIjoiYWRtaW4xIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzYyMTI5NDI5LCJleHAiOjE3NjIxMzMwMjl9.mAs0U5SReX91B8YSygDSP15Ovj0YXILDm3GOmT2mAN8"

STEP 8 — Open HTTPS in Browser
https://localhost:3001


---

## **6. Testing the API (via curl)**

### **6.1 Register a User**

```bash
curl -X POST "http://localhost:3001/auth/register" ^
-H "Content-Type: application/json" ^
-d "{\"username\":\"bob\",\"password\":\"1234\",\"role\":\"User\"}"
```

**Response:**

```json
{"message":"Registration successful"}
```

---

### **6.2 Login**

```bash
curl -X POST "http://localhost:3001/auth/login" ^
-H "Content-Type: application/json" ^
-d "{\"username\":\"bob\",\"password\":\"1234\"}"
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN_HERE>"
}
```

Copy the token value.

---

### **6.3 Access Protected Route – /profile**

```bash
curl -X GET "http://localhost:3001/profile" ^
-H "Authorization: Bearer <JWT_TOKEN_HERE>"
```

**Response:**

```json
{
  "profile": {
    "id": "6907e965c8156621acd67220",
    "username": "bob",
    "role": "User"
  }
}
```

---

### **6.4 Access Role-Based Route – /dashboard**

```bash
curl -X GET "http://localhost:3001/dashboard" ^
-H "Authorization: Bearer <JWT_TOKEN_HERE>"
```

**Response (User):**

```json
{"features":["A"]}
```

**Response (Admin):**

```json
{"features":["A","B","C"]}
```

---

## **7. Role-Based Access Example**

### **7.1 Register Admin**

```bash
curl -X POST "http://localhost:3001/auth/register" ^
-H "Content-Type: application/json" ^
-d "{\"username\":\"admin1\",\"password\":\"adminpass\",\"role\":\"Admin\"}"
```

### **7.2 Login as Admin**

```bash
curl -X POST "http://localhost:3001/auth/login" ^
-H "Content-Type: application/json" ^
-d "{\"username\":\"admin1\",\"password\":\"adminpass\"}"
```

### **7.3 Access Dashboard as Admin**

```bash
curl -X GET "http://localhost:3001/dashboard" ^
-H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

**Response:**

```json
{"features":["A","B","C"]}
```

---

## **8. Testing Using Thunder Client or Postman**

If you prefer a GUI:

1. Open **VS Code** → install the **Thunder Client** extension.
2. Create a new request:

   * Method: `POST`
   * URL: `http://localhost:3001/auth/register`
   * Body: JSON → raw:

     ```json
     {"username": "bob", "password": "1234", "role": "User"}
     ```
3. Add header for protected routes:

   ```
   Authorization: Bearer <JWT_TOKEN_HERE>
   ```

---

## **9. Error Handling Examples**

### **No Token Provided**

```bash
curl -X GET "http://localhost:3001/profile"
```

**Response:**

```json
{"message":"Access denied. No token provided."}
```

### **Invalid Credentials**

```bash
curl -X POST "http://localhost:3001/auth/login" ^
-H "Content-Type: application/json" ^
-d "{\"username\":\"wrong\",\"password\":\"wrong\"}"
```

**Response:**

```json
{"message":"Invalid username or password"}
```

---

## **10. Directory Structure**

```
secure-https-server/
│
├── app.js
├── .env
├── package.json
├── /cert
│   ├── private-key.pem
│   └── certificate.pem
├── /middleware
│   └── auth.js
├── /models
│   └── User.js
├── /routes
│   ├── auth.js
│   └── static.js
└── /public
    └── index.html
```

---

## **11. Troubleshooting**

| Issue                                        | Cause                        | Solution                                      |
| -------------------------------------------- | ---------------------------- | --------------------------------------------- |
| `EADDRINUSE: address already in use :::3001` | Port 3001 is already in use  | Stop other process or change `PORT` in `.env` |
| `Cannot find module 'auth.js'`               | File path incorrect          | Ensure `/middleware/auth.js` exists           |
| `'openssl' is not recognized`                | OpenSSL not in PATH          | Install Git Bash or add OpenSSL to PATH       |
| `Invalid username or password`               | Wrong credentials            | Check username and password stored in MongoDB |
| `Access denied. No token provided.`          | Missing Authorization header | Add `Authorization: Bearer <token>`           |

---

## **12. Security Notes**

* Always store `JWT_SECRET` and `SESSION_SECRET` securely.
* Use HTTPS for production.
* Tokens expire in **1 hour** by default.
* Cookies are set with `httpOnly`, `secure`, and `sameSite="none"` flags for maximum protection.

---


## **13. Author**

Developed by **Deepti**
Web Design & Development – **SAIT College**
For academic and portfolio demonstration purposes.
