
# 📚  Library Management System (SQLite)

A lightweight **Library Management System** built with **SQLite** as the database.  
This project demonstrates how to design, model, and manage a relational database for a small-scale library.  
It includes tables for books, authors, publishers, members, and loans — complete with relationships and constraints.

---

## 🧩 Features

- 🗂️ Well-structured database schema for library operations  
- 📘 Manage books, authors, publishers, and categories  
- 👥 Track members and their loan records  
- ⏱️ Monitor book availability and due dates  
- 🔐 Enforced data integrity with foreign keys and constraints  
- 💾 Uses **SQLite** — a simple, file-based relational database  

---

## 🗃️ Database Schema Overview

**Entities included:**

- `authors`  
- `publishers`  
- `categories`  
- `books`  
- `copies`  
- `members`  
- `loans`  

**Relationships:**

- One **publisher** → many **books**  
- One **book** → many **copies**  
- One **member** → many **loans**  
- One **copy** → one **loan** at a time  

---

## 🧭 Entity Relationship Diagram (ERD)

Below is the ERD for this project — designed using **Mermaid Live Editor**.

```mermaid
erDiagram
    PUBLISHERS ||--o{ BOOKS : publishes
    AUTHORS ||--o{ BOOKS : writes
    CATEGORIES ||--o{ BOOKS : classified_as
    BOOKS ||--o{ COPIES : has
    MEMBERS ||--o{ LOANS : makes
    COPIES ||--o{ LOANS : involved_in

    PUBLISHERS {
        INTEGER id PK
        TEXT name
    }

    AUTHORS {
        INTEGER id PK
        TEXT name
    }

    CATEGORIES {
        INTEGER id PK
        TEXT name
    }

    BOOKS {
        INTEGER id PK
        TEXT title
        INTEGER publisher_id FK
        DATE published_date
        INTEGER pages
    }

    MEMBERS {
        INTEGER id PK
        TEXT name
        TEXT email
        TEXT phone
        DATETIME registered_at
    }

    COPIES {
        INTEGER id PK
        INTEGER book_id FK
        TEXT barcode
        TEXT status
    }

    LOANS {
        INTEGER id PK
        INTEGER copy_id FK
        INTEGER member_id FK
        DATETIME loaned_at
        DATETIME due_at
        DATETIME returned_at
        DECIMAL fine
    }
````

---

## 🧱 Project Structure

```
day13-sql-library-schema/
├── schema.sql       # Main database schema (tables, relationships)
├── seed.sql         # Optional sample data
├── day13.db         # SQLite database file
├── README.md        # Project documentation
└── (optional) app/  # For backend integration later
```

---

## ⚙️ Setup Instructions

### 1️⃣ Create the database

```bash
sqlite3 day13.db < schema.sql
```

### 2️⃣ (Optional) Populate with sample data

```bash
sqlite3 day13.db < seed.sql
```

### 3️⃣ Verify tables

```bash
sqlite3 day13.db
sqlite> .tables
sqlite> SELECT * FROM books;
```

---

## 🧠 Example Queries

Get all books:

```sql
SELECT * FROM books;
```

Get available copies:

```sql
SELECT b.title, c.id AS copy_id
FROM copies c
JOIN books b ON c.book_id = b.id
WHERE c.status = 'available';
```

Check member loans:

```sql
SELECT m.name, b.title, l.loaned_at, l.due_at
FROM loans l
JOIN members m ON l.member_id = m.id
JOIN copies c ON l.copy_id = c.id
JOIN books b ON c.book_id = b.id;
```

---

## 🚀 Next Steps

* [ ] Build a REST API using Node.js + Express
* [ ] Implement CRUD routes for all entities
* [ ] Add input validation and error handling
* [ ] Add a simple frontend dashboard
* [ ] Deploy with a persistent SQLite database

---

## 🧑‍💻 Author

**Enya Elvis**
Full-Stack Developer | Tech Enthusiast | Educator
📍 Cross River, Nigeria
💬 “If you want to go fast, go alone. If you want to go far, go together.”

---

## 🪪 License

This project is open-source and available under the **MIT License**.

---

## 💡 Acknowledgments

* [SQLite Documentation](https://www.sqlite.org/docs.html)
* [Mermaid Live Editor](https://mermaid.live/)
