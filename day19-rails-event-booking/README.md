# Day 19 — Event Booking System (Lightweight Rails-style)

This folder contains a small, well-documented event booking web application written in Ruby.

Note: the original challenge lists "Ruby on Rails" for Day 19. For portability and to keep this demo small and easy to run without generating a full Rails app, this implementation uses Sinatra + Sequel and aims to follow Rails best-practice ideas (MVC structure, clear tests, and documented code). If you want a full Rails scaffold instead, I can generate one — it will be larger and requires Rails to be installed.

What's included
- Minimal REST API: create/list events, book a seat, cancel a booking
- Persistence: SQLite (file at `db/events.db`) using Sequel ORM
- Tests: RSpec + rack-test
- Linting: RuboCop config

Requirements
- Ruby 2.7+ (tested with 2.7/3.x)
- Bundler

Quick start

```bash
cd day19-rails-event-booking
bundle install
# Create the database and start the app
bundle exec rackup -p 4567

# If you see "bundler: command not found: rackup", use the included start wrapper:
./bin/start

# In another terminal run tests
bundle exec rspec -f doc
```

API (JSON)
- GET /events -> list events
- POST /events -> create event {"title": "Name", "capacity": 100}
- POST /events/:id/book -> book a seat {"name": "Alice"}
- DELETE /events/:id/bookings/:booking_id -> cancel a booking

Notes & Best practices followed
- Clear MVC separation: `app/models`, `app/controllers` (single Sinatra app file)
- YARD/RDoc-style documentation for public classes & methods
- Small, focused tests that exercise core flows
- Input validation & error handling with appropriate HTTP status codes
- A simple RuboCop config to keep code style consistent

Next steps (optional)
- Convert to a full Rails API app (generators, migrations, ActiveRecord)
- Add authentication & user accounts
- Add background jobs (e.g., confirmation emails)

If you'd like the full Rails scaffold instead, tell me and I will generate a Rails API app and wire up equivalent controllers and tests.

Troubleshooting
- If you run `bundle exec rackup` and see `bundler: command not found: rackup`, try the included wrapper:

```bash
./bin/start
```

- If `./bin/start` fails because the system Ruby snap is missing components (common with some snap installs), you can:
	1. Install Ruby via your package manager (apt) or a version manager like rbenv or rvm.
	2. Install `bundler` and gems: `gem install bundler && bundle install`.
	3. Ensure `rackup` is on PATH (comes from the `rack` gem) or run `ruby -S rackup`.

