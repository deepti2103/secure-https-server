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

## How to Clone and Run This Project

git clone https://github.com/<your-username>/secure-https-server.git
cd secure-https-server
npm install
Create a file named .env in the project root and add your credentials:
MONGO_URI=mongodb+srv://<your-cluster-url>
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=3001
CLIENT_ORIGIN=http://localhost:3000

npx nodemon app.js


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
curl -X GET "http://localhost:3001/dashboard" -H "Authorization: Bearer <token>"

STEP 6 — Login as admin1
curl -X POST "http://localhost:3001/auth/login" -H "Content-Type: application/json" -d "{\"username\":\"admin1\",\"password\":\"adminpass\"}"

STEP 7 — Access /dashboard as Admin
curl -X GET "http://localhost:3001/dashboard" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDdmMmM5MDhiZWVhMzRlZGM5OTA4NCIsInVzZXJuYW1lIjoiYWRtaW4xIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzYyMTMwNDAxLCJleHAiOjE3NjIxMzQwMDF9.uh8PLfO6SRJkIOSi4ZmsMPzsgLVCwh-rj4a7RtXZerg"

STEP 8 — Open HTTPS in Browser
https://localhost:3001

---

##  Testing Using Thunder Client or Postman**

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

##  Error Handling Examples**

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

##  Directory Structure**

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

##  Troubleshooting**

| Issue                                        | Cause                        | Solution                                      |
| -------------------------------------------- | ---------------------------- | --------------------------------------------- |
| `EADDRINUSE: address already in use :::3001` | Port 3001 is already in use  | Stop other process or change `PORT` in `.env` |
| `Cannot find module 'auth.js'`               | File path incorrect          | Ensure `/middleware/auth.js` exists           |
| `'openssl' is not recognized`                | OpenSSL not in PATH          | Install Git Bash or add OpenSSL to PATH       |
| `Invalid username or password`               | Wrong credentials            | Check username and password stored in MongoDB |
| `Access denied. No token provided.`          | Missing Authorization header | Add `Authorization: Bearer <token>`           |

---

##  Security Notes**

* Always store `JWT_SECRET` and `SESSION_SECRET` securely.
* Use HTTPS for production.
* Tokens expire in **1 hour** by default.
* Cookies are set with `httpOnly`, `secure`, and `sameSite="none"` flags for maximum protection.

---


##  Author**

Developed by **Deepti**
Web Design & Development – **SAIT College**
For academic and portfolio demonstration purposes.
