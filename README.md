🔹 Live Demo Badge (Frontend)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://frontend-dashboard-87.vercel.app)


🔹 Backend API Badge
[![Backend API](https://img.shields.io/badge/API-Online-blue)](https://auth-fullstack-project.onrender.com)

A production-style authentication system with secure JWT login, protected APIs, and detailed audit logging.
Built to demonstrate real-world backend security, API design, and frontend integration.

TECH FOCUS : Auth, Security, JWT, Guards, Audit Logs, Full-Stack Architecture

✨ HIGHLIGHTS

🔑 JWT Authentication (Signup / Signin)
🛡 Protected APIs using Guards & Passport
🔒 Password hashing with bcrypt
📊 User-specific audit logs
⏱ Token expiry & invalid token handling
🔁 Automatic redirect on logout / expiry
🧪 Fully tested end-to-end

🧠 ARCHITECTURE OVERVIEW

Frontend (SvelteKit)
   ↓  JWT (Authorization Header)
Backend (NestJS)
   ↓
JWT Guard → Strategy → Controller
   ↓
Supabase (PostgreSQL)


Key Principle:
👉 Frontend never talks to the database directly
👉 All sensitive operations stay on the backend

🧱 TECH STACK

Backend

NestJS (Modular architecture)
JWT + Passport
Supabase (PostgreSQL)
bcrypt
TypeScript

Frontend

SvelteKit
TypeScript
JWT stored securely in localStorage

🔐 AUTHENTICATION FLOW

User signs up or signs in
Password hashed with bcrypt
JWT issued by backend
Token stored in frontend
Token sent in:
Authorization: Bearer <token>
Protected routes validated via JwtStrategy
Invalid / expired token → 401 + redirect

📊 DASHBOARD (Protected)

Displays login attempts for the authenticated user only

Includes:

Timestamp
IP address
User agent
Success / failure
Fully protected using JWT Guard

🧪 TESTING

All critical flows tested manually and via browser tools:

✔ Signup
✔ Signin
✔ Token generation
✔ Token validation
✔ Token expiry
✔ Tampered token rejection (401)
✔ Signout behavior

⚙️ ENVIRONMENT SETUP
Backend .env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret

Frontend .env
VITE_BACKEND_URL=http://localhost:3000

This project showcases:
Real-world authentication patterns
Clean NestJS architecture
Secure API design
Frontend ↔ Backend integration
Production-ready guard & strategy usage


✔ Protected dashboard access

✔ Unauthorized access prevention
