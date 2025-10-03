# Day 10 — Laravel-style Cart API (Lightweight PHP)

This is a small, self-contained PHP API inspired by Laravel-style routes/controllers. It's intentionally lightweight so you can run it without Composer or a full Laravel installation.

Features
- Add items to a cart
- Remove items
- View cart
- Clear cart
- Per-client cart storage (file-based JSON in `storage/`)

Quick start (PowerShell)

```powershell
cd day10-laravel-cart-api
# Run PHP built-in server and use index.php as router
php -S localhost:8000 index.php
```

API (examples)

All requests require a client identifier. Provide it with an `X-Client-Id` header or `?client_id=` query string.

Get cart

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:8000/cart" -Headers @{ 'X-Client-Id' = 'test-client' }
```

Add item

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8000/cart/add" -Headers @{ 'X-Client-Id' = 'test-client' } -Body (ConvertTo-Json @{ product_id = 'sku-123'; name='T-shirt'; price=19.99; quantity=2 })
```

Remove item

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8000/cart/remove" -Headers @{ 'X-Client-Id' = 'test-client' } -Body (ConvertTo-Json @{ product_id = 'sku-123' })
```

Clear cart

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8000/cart/clear" -Headers @{ 'X-Client-Id' = 'test-client' }
```

Notes
- This is not a full Laravel app. If you want a true Laravel scaffold, I can provide Composer commands and a minimal Laravel setup, but that requires Composer and more setup time.
- Storage is file-based for simplicity; for production, switch to a database.
