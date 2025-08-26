# 🚀 30 Days Backend Challenge

Welcome to my 30 Projects in 30 Days challenge! 🎯
The goal is to improve backend skills across multiple programming languages by building one project per day.

Each project is small but practical — covering APIs, authentication, databases, microservices, CLI tools, and automation scripts.

## Table of contents

- [Project structure](#project-structure)
- [Daily Projects](#daily-projects)
- [Objectives](#objectives)
- [How to run](#how-to-run)
- [Author](#author)

## 📂 Project Structure

```
30DaysBackendChallenge/
├── day01-php-login/
│   ├── dashboard.php
│   ├── index.php
│   ├── login.php
│   ├── README.md
│   ├── register.php
│   ├── users.txt
│   └── assets/
│       ├── app.js
│       ├── icon-lock.svg
│       ├── icon-shield.svg
│       ├── icon-speed.svg
│       ├── icon-theme.svg
│       ├── illustration.svg
│       └── style.css
├── day02-python-url-shortener/
├── day03-node-task-api/
├── day04-go-quotes-api/
├── day05-ruby-cli-todo/
├── day06-csharp-file-uploader/
├── day07-bash-backup-script/
├── day08-node-jwt-auth/
├── day09-django-blog/
├── day10-laravel-cart-api/
├── day11-go-student-api/
├── day12-rust-password-manager/
├── day13-sql-library-schema/
├── day14-java-banking-api/
├── day15-node-payment-gateway/
├── day16-fastapi-weather/
├── day17-php-forum-api/
├── day18-go-chat-server/
├── day19-rails-event-booking/
├── day20-csharp-inventory-api/
├── day21-bash-python-deploy/
├── day22-node-redis-cache/
├── day23-fastapi-image-service/
├── day24-laravel-email-api/
├── day25-go-rate-limiter/
├── day26-rust-log-parser/
├── day27-java-roles-api/
├── day28-csharp-notification-service/
├── day29-django-social-api/
└── day30-microservices-project/
```

## 📅 Daily Projects

| Day | Project | Language / Stack | Description |
| ---: | --- | --- | --- |
| 01 | 🔑 Login & Registration System | PHP | Basic user signup/login with file storage |
| 02 | 🔗 URL Shortener | Python (Flask) | Shorten and manage URLs with SQLite |
| 03 | 📋 Task Manager API | Node.js (Express) | CRUD API for managing tasks |
| 04 | 📜 Quotes API | Go | Serve random quotes in JSON format |
| 05 | 📝 CLI Todo List | Ruby | Terminal-based todo list manager |
| 06 | 📂 File Uploader | C# (.NET) | Backend to upload and save files |
| 07 | 💾 Backup Script | Bash | Automate file backups with cron |
| 08 | 🔒 JWT Authentication API | Node.js | Secure login/register with JWT & bcrypt |
| 09 | ✍️ Blog Backend | Python (Django) | Blog CRUD with PostgreSQL |
| 10 | 🛒 E-commerce Cart API | PHP (Laravel) | Cart endpoints: add/remove/view |
| 11 | 🎓 Student Records API | Go + MongoDB | CRUD API for managing students |
| 12 | 🔐 Password Manager | Rust | CLI app to store and retrieve passwords |
| 13 | 📚 Library DB Schema | SQL | Database schema & queries for a library |
| 14 | 💳 Banking Transactions API | Java (Spring Boot) | Transfer & balance management |
| 15 | 💵 Payment Gateway Simulation | Node.js | API with webhook handling |
| 16 | 🌦️ Weather API Wrapper | Python (FastAPI) | Proxy API that fetches weather data |
| 17 | 💬 Forum Backend | PHP + MySQL | Forum posts & comments API |
| 18 | 💻 Chat Server | Go (WebSockets) | Real-time chat server |
| 19 | 🎟️ Event Booking System | Ruby on Rails | Events & booking CRUD |
| 20 | 📦 Inventory API | C# (.NET Core) | Manage product inventory |
| 21 | 🚀 Deployment Script | Bash + Python | Auto-pull & restart project |
| 22 | ⚡ Caching Service | Node.js + Redis | API with caching for fast responses |
| 23 | 🖼️ Image Processing Service | Python (FastAPI) | Upload & resize images |
| 24 | 📧 Email Verification API | PHP (Laravel) | Email verification & reset system |
| 25 | ⏱️ Rate Limiter API | Go | Prevent abuse with request limits |
| 26 | 📊 Log Parser | Rust | CLI tool to parse logs & save in DB |
| 27 | 👥 User Roles API | Java (Spring Boot) | Roles & permissions management |
| 28 | 🔔 Notification Service | C# + SignalR | Real-time push notifications |
| 29 | 🌍 Social Media API | Django REST | Posts, likes & user interactions |
| 30 | 🌐 Microservices Project | Node.js + Python + Go | Auth, Posts & Notifications microservices |

## Objectives

## Day 02 — URL Shortener (Python / Flask)

A small, practical URL shortener built with Flask and SQLite. The service provides a minimal web UI to create short links, a JSON API for programmatic use, and tests that run against an in-memory SQLite database.

Key features
- Shorten long URLs to short codes
- Redirect short codes to original URLs and track click counts
- Optional expiry for short links
- Minimal, responsive frontend with copy-to-clipboard

Quick start (PowerShell)

```powershell
cd day02-python-url-shortener
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# copy .env.example to .env and edit values if needed
$Env:FLASK_APP = 'app:create_app()'
$Env:FLASK_ENV = 'development'
flask run
```

Run tests

```powershell
cd day02-python-url-shortener
.\.venv\Scripts\Activate.ps1
pytest -q
```

See `day02-python-url-shortener/README.md` for full implementation notes and advanced configuration.

- Build 30 backend projects across different languages and stacks.
- Gain practical experience with APIs, databases, caching, authentication, and deployment.
- Produce a portfolio of small, demonstrable backend projects.

## How to run

Each project folder contains its own `README.md` with a short goal, tech stack, and run instructions.

Example (Day 1):

```powershell
cd day01-php-login
php -S localhost:8000
```

## Author

Enya Elvis ✨
Backend Developer | Full-stack Enthusiast | Tech Explorer

> Each day this repo will be updated with a new project. Stay tuned! 🎉
