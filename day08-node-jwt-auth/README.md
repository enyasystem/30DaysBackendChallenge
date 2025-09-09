# Day 08 — JWT Authentication API

Small Express app demonstrating registration and login with JWT and bcrypt.

Quick start (PowerShell):

```powershell
cd day08-node-jwt-auth
npm install
copy .env.example .env
# edit .env to set JWT_SECRET
$env:JWT_SECRET = 'your_secret_here' # or set in .env
node app.js
```

Endpoints:
- POST /api/auth/register { username, password }
- POST /api/auth/login { username, password } -> { token }
- GET /api/protected (requires header Authorization: Bearer <token>)

Notes:
- This project uses an in-memory user store (`models/userModel.js`). Replace with a database for persistence.
- For development you can use `npm run dev` if you install `nodemon` globally or as a devDependency.
