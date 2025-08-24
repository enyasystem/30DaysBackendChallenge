# PHP Login & Registration System

Simple file-backed authentication system for Day 1 of the challenge.

How to run

1. Open a terminal in the project folder (where `index.php` is).
2. Start PHP built-in server:

```powershell
php -S localhost:8000 -t .
```

3. Visit http://localhost:8000/ in your browser.

Features

- Register (saves username|hashed_password to `users.txt`)
- Login (verifies with password_verify)
- Session-protected dashboard

Notes

- This is a minimal example for learning. Do not use file-based auth for production.
