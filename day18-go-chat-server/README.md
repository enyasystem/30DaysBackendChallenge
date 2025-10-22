# Day 18 — Go WebSocket Chat Server

Minimal WebSocket chat server written in Go using Gorilla WebSocket. Serves a tiny static client from `/static`.

Run locally:

```bash
cd day18-go-chat-server
go mod tidy
go run .
# then open http://localhost:8080
```

The WebSocket endpoint is `/ws` and accepts a `username` query parameter.
