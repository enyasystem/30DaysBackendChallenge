package main

import (
    "testing"
    "time"
)

func TestHubRegisterUnregister(t *testing.T) {
    h := NewHub()
    go h.Run()

    // create fake clients
    c1 := &Client{hub: h, send: make(chan []byte, 10), username: "u1"}
    c2 := &Client{hub: h, send: make(chan []byte, 10), username: "u2"}

    h.register <- c1
    h.register <- c2
    time.Sleep(10 * time.Millisecond)

    if len(h.clients) != 2 {
        t.Fatalf("expected 2 clients, got %d", len(h.clients))
    }

    h.unregister <- c1
    time.Sleep(10 * time.Millisecond)
    if len(h.clients) != 1 {
        t.Fatalf("expected 1 client, got %d", len(h.clients))
    }
}
