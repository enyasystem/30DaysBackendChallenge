# 📜 Quotes API (Go)

A simple RESTful API in Go that serves random quotes in JSON format.

## 🚀 Features
- Get a random quote: `GET /api/quote`
- List all quotes: `GET /api/quotes`
- In-memory data (no database required)

## 🛠️ Tech Stack
- Go
- Gorilla Mux (router)

## 🏁 How to Run
```powershell
cd day04-go-quotes-api
go run main.go
```

## 🧪 Example Usage
- Get a random quote:
  - `curl http://localhost:8080/api/quote`
- Get all quotes:
  - `curl http://localhost:8080/api/quotes`

---

Part of the #30DaysOfBackend challenge by Enya Elvis
