# Day 13 — Library Management System (SQLite)

Lightweight library schema and examples using SQLite. This project demonstrates database design for a small library: books, authors, publishers, categories, physical copies, members and loans, plus many‑to‑many join tables.

---

## Quick start

1. Recreate the database and load schema

```bash
rm -f day13.db
sqlite3 day13.db < schema.sql
```

2. Load sample data

```bash
sqlite3 day13.db < seed.sql
```

3. Create join tables (if not already present in `schema.sql`)

```bash
sqlite3 day13.db <<'SQL'
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS book_authors (
  book_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  PRIMARY KEY (book_id, author_id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_book_authors_author ON book_authors(author_id);

CREATE TABLE IF NOT EXISTS book_categories (
  book_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (book_id, category_id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_book_categories_category ON book_categories(category_id);
SQL
```

4. Open interactive shell for exploration

```bash
sqlite3 day13.db
-- inside sqlite3:
.headers on
.mode column
.tables
```

---

## Useful queries

- List all books (with publisher, authors, categories):

```sql
SELECT
  b.id,
  b.title,
  p.name AS publisher,
  group_concat(DISTINCT a.name, ', ') AS authors,
  group_concat(DISTINCT c2.name, ', ') AS categories,
  b.published_date,
  b.pages
FROM books b
LEFT JOIN publishers p ON b.publisher_id = p.id
LEFT JOIN book_authors ba ON ba.book_id = b.id
LEFT JOIN authors a ON a.id = ba.author_id
LEFT JOIN book_categories bc ON bc.book_id = b.id
LEFT JOIN categories c2 ON c2.id = bc.category_id
GROUP BY b.id, b.title, p.name
ORDER BY b.title;
```

- Books with available copies:

```sql
SELECT
  b.id,
  b.title,
  SUM(CASE WHEN c.status='available' THEN 1 ELSE 0 END) AS available_copies,
  COUNT(c.id) AS total_copies
FROM books b
LEFT JOIN copies c ON c.book_id = b.id
GROUP BY b.id, b.title
ORDER BY available_copies DESC, b.title;
```

- Show all available copies (title + barcode):

```sql
SELECT b.title, c.id AS copy_id, c.barcode
FROM copies c
JOIN books b ON c.book_id = b.id
WHERE c.status = 'available'
ORDER BY b.title, c.barcode;
```

---

## Safe checkout / return patterns (transactional)

Use a temporary table inside a transaction to safely pick a copy, insert a loan, and update copy status.

- Checkout (example: book_id and member_id variables):

```bash
sqlite3 day13.db <<'SQL'
PRAGMA foreign_keys=ON;
BEGIN;
CREATE TEMP TABLE tmp_sel (id INTEGER);
INSERT INTO tmp_sel (id) SELECT id FROM copies WHERE book_id=<BOOK_ID> AND status='available' LIMIT 1;
INSERT INTO loans(copy_id, member_id, loaned_at, due_at)
  SELECT id, <MEMBER_ID>, datetime('now'), datetime('now','+14 days') FROM tmp_sel;
UPDATE copies SET status='loaned' WHERE id IN (SELECT id FROM tmp_sel);
DROP TABLE tmp_sel;
COMMIT;
SQL
```

- Return (mark loan returned and set copy available):

```bash
sqlite3 day13.db <<'SQL'
PRAGMA foreign_keys=ON;
BEGIN;
CREATE TEMP TABLE tmp_return AS
  SELECT id AS loan_id, copy_id FROM loans
  WHERE member_id=<MEMBER_ID> AND returned_at IS NULL
  ORDER BY loaned_at LIMIT 1;
UPDATE loans SET returned_at = datetime('now') WHERE id IN (SELECT loan_id FROM tmp_return);
UPDATE copies SET status = 'available' WHERE id IN (SELECT copy_id FROM tmp_return);
DROP TABLE tmp_return;
COMMIT;
SQL
```

Notes:
- Use `INSERT OR IGNORE` for idempotent seeding to avoid UNIQUE conflicts.
- Keep `schema.sql` authoritative so `schema.sql` fully reproduces the DB structure.

---

## Next steps & exercises

- Add `queries.sql` with example reports: overdue loans, popular books, member history.
- Build a small REST API (Express / FastAPI) to expose search and checkout operations.
- Port schema to PostgreSQL and test concurrent checkouts.

---

## Author

Enya Elvis — Full-Stack Developer

---

License: MIT
