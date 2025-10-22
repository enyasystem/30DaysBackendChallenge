
# Day 18 — Go WebSocket Chat Server

Minimal WebSocket chat server written in Go using Gorilla WebSocket. The project includes a tiny static client (served from `/static`) for manual testing.

Key features
- WebSocket endpoint at `/ws` (accepts `username` query parameter)
- Broadcasts chat messages, join/leave events and a users snapshot
- Enforces unique usernames (server rejects duplicate username connections)
- Simple client UI that shows messages, avatars, and aligns sender messages to the right

Endpoints
- GET /      -> serves the static client (open in your browser)
- GET /ws    -> WebSocket upgrade endpoint. Provide `?username=yourname` when connecting.

Message schema (JSON)
- Client -> Server
	- Join (optional if provided as query param): { "type": "join", "username": "alice" }
	- Message: { "type": "message", "body": "Hello everyone" }

- Server -> Clients
	- Message: { "type": "message", "id": "", "username": "alice", "body": "Hi!", "ts": 169xxxx }
	- User Joined: { "type": "join", "username": "bob" }
	- User Left: { "type": "leave", "username": "bob" }
	- Users List: { "type": "users", "users": ["alice","bob"] }
	- Error: { "type": "error", "error": "reason" }

Notes
- Username uniqueness: the server maintains a map of connected usernames and will reject a new connection if that username is already in use. The client receives an `error` message and the connection is closed.
- Join order is preserved and sent in the `users` snapshot so clients can display users in the same order the server tracked them.
- The static client places messages sent by the local user on the right and messages from others on the left (standard chat UX).

Run locally

```bash
cd day18-go-chat-server
go mod tidy
go run .
# open http://localhost:8080 in your browser
```

Build

```bash
cd day18-go-chat-server
go mod tidy
go build ./...
```

Run tests

There is a small unit test for the hub logic. Note: the server's `main` will start a listening process when run, so tests focus on the hub where possible.

```bash
cd day18-go-chat-server
go test ./...
```

Docker (example)

Create a `Dockerfile` like this:

```dockerfile
FROM golang:1.20-alpine AS build
WORKDIR /src
COPY . .
RUN go build -o chat-server ./...

FROM alpine:latest
WORKDIR /app
COPY --from=build /src/chat-server ./chat-server
COPY static ./static
EXPOSE 8080
CMD ["./chat-server"]
```

Security & next steps
- Add authentication (JWT) if you want to restrict who can connect.
- Use Redis pub/sub for horizontal scaling (multiple server instances).
- Persist chat history in a database if you need replay or audit logs.
- Improve tests to mock websockets and exercise broadcast delivery.

License & attribution
- Uses `github.com/gorilla/websocket` for WebSocket handling.
