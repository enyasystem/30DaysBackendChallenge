package main

import (
    "encoding/json"
    "flag"
    "log"
    "net/http"
    "os"
)

func encodeMessage(m Message) []byte {
    b, _ := json.Marshal(m)
    return b
}

func main() {
    addr := flag.String("addr", ":8080", "http service address")
    flag.Parse()

    h := NewHub()
    go h.Run()

    fs := http.FileServer(http.Dir("static"))
    http.Handle("/", fs)
    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        serveWs(h, w, r)
    })

    log.Printf("server starting on %s", *addr)
    if err := http.ListenAndServe(*addr, nil); err != nil {
        log.Fatal(err)
        os.Exit(1)
    }
}
