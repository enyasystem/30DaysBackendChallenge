package main

import "sync"

// Hub maintains the set of active clients and broadcasts messages.
type Hub struct {
    // Registered clients.
    clients map[*Client]bool
    // username -> client
    users map[string]*Client
    // ordered list of usernames for snapshots
    order []string

    // Inbound messages from the clients.
    broadcast chan Message

    // Register requests from the clients.
    register chan *Client

    // Unregister requests from clients.
    unregister chan *Client

    // Protect clients map
    mu sync.RWMutex
}

func NewHub() *Hub {
    return &Hub{
        clients:    make(map[*Client]bool),
        broadcast:  make(chan Message),
        register:   make(chan *Client),
        unregister: make(chan *Client),
        users:      make(map[string]*Client),
        order:      make([]string, 0),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case c := <-h.register:
            h.mu.Lock()
            h.clients[c] = true
            if c.username != "" {
                h.users[c.username] = c
                h.order = append(h.order, c.username)
            }
            h.mu.Unlock()
            // announce without writing to h.broadcast to avoid self-send deadlock
            h.broadcastToClients(Message{Type: MsgJoin, Username: c.username})
            h.sendUsersSnapshot()
        case c := <-h.unregister:
            h.mu.Lock()
            if _, ok := h.clients[c]; ok {
                delete(h.clients, c)
                if c.username != "" {
                    delete(h.users, c.username)
                    // remove from order slice
                    for i, u := range h.order {
                        if u == c.username {
                            h.order = append(h.order[:i], h.order[i+1:]...)
                            break
                        }
                    }
                }
                close(c.send)
                h.mu.Unlock()
                h.broadcastToClients(Message{Type: MsgLeave, Username: c.username})
                h.sendUsersSnapshot()
            } else {
                h.mu.Unlock()
            }
        case m := <-h.broadcast:
            h.broadcastToClients(m)
        }
    }
}

func (h *Hub) sendUsersSnapshot() {
    h.mu.RLock()
    users := make([]string, 0, len(h.order))
    users = append(users, h.order...)
    h.mu.RUnlock()
    h.broadcastToClients(Message{Type: MsgUsers, Users: users})
}

// UsernameExists returns true if the username is already connected
func (h *Hub) UsernameExists(name string) bool {
    h.mu.RLock()
    defer h.mu.RUnlock()
    if name == "" {
        return false
    }
    _, ok := h.users[name]
    return ok
}

func (h *Hub) broadcastToClients(m Message) {
    b := encodeMessage(m)
    var toRemove []*Client
    h.mu.RLock()
    for client := range h.clients {
        select {
        case client.send <- b:
        default:
            toRemove = append(toRemove, client)
        }
    }
    h.mu.RUnlock()

    if len(toRemove) > 0 {
        h.mu.Lock()
        for _, c := range toRemove {
            if _, ok := h.clients[c]; ok {
                close(c.send)
                delete(h.clients, c)
            }
        }
        h.mu.Unlock()
    }
}
