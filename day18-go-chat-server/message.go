package main

import "time"

type MessageType string

const (
    MsgMessage MessageType = "message"
    MsgJoin    MessageType = "join"
    MsgLeave   MessageType = "leave"
    MsgUsers   MessageType = "users"
    MsgError   MessageType = "error"
)

type Message struct {
    Type     MessageType `json:"type"`
    ID       string      `json:"id,omitempty"`
    Username string      `json:"username,omitempty"`
    Body     string      `json:"body,omitempty"`
    Users    []string    `json:"users,omitempty"`
    Error    string      `json:"error,omitempty"`
    Ts       int64       `json:"ts,omitempty"`
}

func NewChatMessage(id, username, body string) Message {
    return Message{Type: MsgMessage, ID: id, Username: username, Body: body, Ts: time.Now().UnixMilli()}
}
