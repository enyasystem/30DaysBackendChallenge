# Day 20 — Inventory API (C# .NET)

A minimal, well-documented Inventory API built with .NET 7. The API demonstrates best practices: dependency injection, DTOs, validation, clear XML documentation, and unit tests using xUnit.

Features
- CRUD operations for inventory items
- In-memory repository (replaceable with real DB)
- Validation and error handling
- Unit tests covering controllers and services

Requirements
- .NET 8 SDK (recommended) — project targets .NET 8 for compatibility with recent SDKs

Quick start

```bash
cd day20-csharp-inventory-api
dotnet restore
dotnet build
dotnet run --project src/InventoryApi
```

Cross-origin requests (CORS)

If you call the API from a browser client (different origin), you may see a CORS error like "CORS header 'Access-Control-Allow-Origin' missing". To allow cross-origin requests during development, you can:

- Run the API in Development (the project allows any origin in Development by default):

```bash
ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/InventoryApi
```

- Or specify allowed origins explicitly (production-safe):

```bash
CORS_ALLOWED_ORIGINS="https://example.com,https://localhost:3000" dotnet run --project src/InventoryApi
```

The server will read `CORS_ALLOWED_ORIGINS` (comma-separated) and allow the listed origins.
```

Run tests

```bash
cd day20-csharp-inventory-api
dotnet test
```
