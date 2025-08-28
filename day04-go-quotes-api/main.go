package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"time"
	"github.com/gorilla/mux"
)

// Quote represents a quote with an ID, Author, and Text
//
type Quote struct {
	ID     int    `json:"id"`
	Author string `json:"author"`
	Text   string `json:"text"`
}

// In-memory slice of quotes
var quotes = []Quote{
	{ID: 1, Author: "Albert Einstein", Text: "Life is like riding a bicycle. To keep your balance you must keep moving."},
	{ID: 2, Author: "Oscar Wilde", Text: "Be yourself; everyone else is already taken."},
	{ID: 3, Author: "Maya Angelou", Text: "You will face many defeats in life, but never let yourself be defeated."},
}

// Handler to get a random quote
func getRandomQuote(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	rand.Seed(time.Now().UnixNano())
	q := quotes[rand.Intn(len(quotes))]
	json.NewEncoder(w).Encode(q)
}

// Handler to get all quotes
func getAllQuotes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(quotes)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api/quote", getRandomQuote).Methods("GET")
	r.HandleFunc("/api/quotes", getAllQuotes).Methods("GET")

	// Start server
	port := ":8080"
	println("Quotes API running on http://localhost" + port)
	http.ListenAndServe(port, r)
}
