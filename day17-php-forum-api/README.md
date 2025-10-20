# Day 17 — Forum Backend (PHP)

This day is a learning-first implementation of a minimal Forum API built with PHP. The goal is for you to implement a well-structured, documented, and testable REST API for posts and comments while learning backend best practices.

This README is written as a guide: it defines the project contract, data shapes, recommended folder structure, step-by-step tasks, and how to start a minimal dev server quickly so you can iterate and learn.

## Goals

- Build a RESTful API for forum posts and comments.
- Learn project structure and separation of concerns in PHP.
- Practice input validation, authentication, database migrations, and tests.
- Keep the implementation simple so you can reason about each piece.

Recommended minimal stack
- PHP 8.0+ (built-in server for development)
- SQLite for local development (no external DB required)
- PDO for database access
- PHPUnit (or Pest) for tests

If you prefer a framework: use Laravel (recommended for longer-term learning). This guide focuses on a framework-agnostic implementation so you learn the underlying concepts.

## Small contract (what your API will provide)

- Inputs: JSON bodies and URL params.
- Outputs: JSON responses with HTTP status codes.
- Error modes: validation errors (400), auth failures (401), not found (404), server errors (500).

Success criteria
- Implement endpoints listed below and confirm with basic tests.
- Simple authentication (token-based) that can be swapped later for JWT.
- Clear folder structure, minimal but meaningful tests, and README documentation.

## Data models (shapes)

User
```
{
  id: integer,
  username: string,
  password_hash: string,
  created_at: string (ISO)
}
```

Post
```
{
  id: integer,
  user_id: integer,
  title: string,
  body: string,
  created_at: string,
  updated_at: string|null
}
```

Comment
```
{
  id: integer,
  post_id: integer,
  user_id: integer,
  body: string,
  created_at: string
}
```

## Minimal database schema (SQLite)

Create a file `migrations/001_create_tables.sql` and run it against an SQLite file `database.sqlite`.

SQL (example):

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Endpoints (spec)

Auth
- POST /register — body: { username, password } -> 201 + { id, username }
- POST /login — body: { username, password } -> 200 + { token }

Posts
- GET /posts — list posts (pagination params: page, per_page)
- GET /posts/:id — get a single post with comment count or comments optionally
- POST /posts — create (auth) body: { title, body }
- PUT /posts/:id — update (auth, owner) body: { title?, body? }
- DELETE /posts/:id — delete (auth, owner)

Comments
- GET /posts/:id/comments — list comments for a post
- POST /posts/:id/comments — create comment (auth) body: { body }
- DELETE /comments/:id — delete comment (auth, owner or post owner)

Responses should use JSON and follow a consistent shape, e.g.

Success:
```
{
  "data": ...,
  "meta": { "page": 1, "per_page": 10 }
}
```

Error:
```
{
  "error": "Validation failed",
  "details": { "title": "required" }
}
```

## Folder structure (suggested)

```
day17-php-forum-api/
├── README.md               # this file
├── public/
│   └── index.php           # front controller
├── src/
│   ├── Controllers/        # controllers map requests to actions
│   ├── Models/             # lightweight models interacting with DB
│   ├── Services/           # business logic (validation, auth)
│   ├── Repos/              # data-access layer (PDO queries)
│   └── bootstrap.php       # wiring: DB, router, DI container
├── migrations/
│   └── 001_create_tables.sql
├── tests/
│   └── Feature/            # API-level tests
├── composer.json           # (optional) for dependencies like phpunit
├── database.sqlite         # local DB for development (gitignored)
└── .gitignore
```


## Quick start (no composer, plain PHP + SQLite)

1. Make a directory and create the SQLite file:

```bash
cd day17-php-forum-api
php -r "touch database.sqlite"
sqlite3 database.sqlite < migrations/001_create_tables.sql
```

2. Start the PHP built-in server (serves `public` as document root):

```bash
php -S localhost:8000 -t public
```

3. Implement `public/index.php` as a tiny router that includes `src/bootstrap.php` and dispatches requests to controllers.

4. Test with curl (examples):

```bash
# register
curl -X POST -H "Content-Type: application/json" -d '{"username":"alice","password":"pass"}' http://localhost:8000/register

# create a post (use token header from login)
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"title":"Hello","body":"World"}' http://localhost:8000/posts
```

## Quick start (Laravel alternative)

If you want to use Laravel, the same API contract applies. Laravel gives you auth scaffolding, migrations, factories, and Eloquent models which speed up development and testing.

Commands (to run locally if you choose Laravel):

```bash
# create project (requires composer)
composer create-project laravel/laravel day17-laravel-forum
cd day17-laravel-forum
php artisan make:model Post -m
php artisan make:model Comment -m
php artisan migrate
php artisan serve --port=8000
```

## Tests and exercises (learn by doing)

Start with these small exercises in order. Each exercise is a small commit and should include tests.

1. Create migrations and seed one user.
   - Test: run a script that queries `users` and asserts there is a row.
2. Implement register & login (password_hash + verify). Store a simple API token (random string) in `users` for now.
   - Test: login returns token and protected endpoint rejects missing token.
3. Implement GET /posts and GET /posts/:id.
   - Test: list endpoint returns posts and respects pagination.
4. Implement POST /posts (auth required) + validation (title length, body not empty).
   - Test: unauthorized request is 401; valid request creates post and returns 201.
5. Add comments endpoints and ensure comments are linked to posts.
   - Test: adding a comment increases comment count.
6. Add permissions: only post owner can update/delete; post owner or comment owner can delete comment.
   - Test: others cannot delete.

Extra exercises (stretch)
- Implement rate limiting middleware (simple in-memory per-IP counter).
- Add tests for SQL injection attempts (sanitization) — ensure prepared statements used.
- Add pagination metadata and sorting options.

## Minimal testing setup

- Install PHPUnit via Composer or globally. A tiny `composer.json` with `phpunit/phpunit` is enough.
- Tests should create a temporary SQLite DB (in-memory or a temp file) and run migrations before each test.

Example PHPUnit bootstrap for SQLite in-memory:

```php
// tests/bootstrap.php
$pdo = new PDO('sqlite::memory:');
$pdo->exec(file_get_contents(__DIR__ . '/../migrations/001_create_tables.sql'));
// pass $pdo to repos or DI container for tests
```

## Good practices & checklist

- Use prepared statements (PDO) — avoid string interpolation.
- Validate all user input and return helpful error messages.
- Keep controllers thin and push logic into services.
- Write tests for happy path + 1-2 edge cases per endpoint.
- Use a simple DI approach to pass the PDO instance to repos (factory/builder function).
- Put secrets and config in an `.env` file (do not commit).
- Add `.gitignore` for `database.sqlite` and vendor directories.

Code review checklist
- Are there any direct SQL string interpolations? -> reject.
- Is authentication logic clear and test-covered? -> ensure tests.
- Are error responses consistent and have proper status codes? -> check.
- Is there at least one test for each endpoint? -> ensure coverage.


Happy learning — build small, test often, and iterate!
