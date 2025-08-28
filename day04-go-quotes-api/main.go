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
	{ID: 4, Author: "Nelson Mandela", Text: "The greatest glory in living lies not in never falling, but in rising every time we fall."},
	{ID: 5, Author: "Confucius", Text: "It does not matter how slowly you go as long as you do not stop."},
	{ID: 6, Author: "Steve Jobs", Text: "Your time is limited, so don’t waste it living someone else’s life."},
	{ID: 7, Author: "Mother Teresa", Text: "Spread love everywhere you go. Let no one ever come to you without leaving happier."},
	{ID: 8, Author: "Walt Disney", Text: "The way to get started is to quit talking and begin doing."},
	{ID: 9, Author: "Eleanor Roosevelt", Text: "The future belongs to those who believe in the beauty of their dreams."},
	{ID: 10, Author: "Mark Twain", Text: "The secret of getting ahead is getting started."},
	{ID: 11, Author: "Helen Keller", Text: "Keep your face to the sunshine and you cannot see a shadow."},
	{ID: 12, Author: "Rumi", Text: "What you seek is seeking you."},
	{ID: 13, Author: "Babe Ruth", Text: "Never let the fear of striking out keep you from playing the game."},
	{ID: 14, Author: "Dr. Seuss", Text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose."},
	{ID: 15, Author: "J.K. Rowling", Text: "It is our choices that show what we truly are, far more than our abilities."},
	{ID: 16, Author: "Malala Yousafzai", Text: "One child, one teacher, one book, one pen can change the world."},
	{ID: 17, Author: "Martin Luther King Jr.", Text: "Faith is taking the first step even when you don’t see the whole staircase."},
	{ID: 18, Author: "Leonardo da Vinci", Text: "Learning never exhausts the mind."},
	{ID: 19, Author: "Yoda", Text: "Do, or do not. There is no try."},
	{ID: 20, Author: "Tony Robbins", Text: "The only impossible journey is the one you never begin."},
	{ID: 21, Author: "Sheryl Sandberg", Text: "Done is better than perfect."},
	{ID: 22, Author: "Viktor E. Frankl", Text: "When we are no longer able to change a situation, we are challenged to change ourselves."},
	{ID: 23, Author: "Sun Tzu", Text: "In the midst of chaos, there is also opportunity."},
	{ID: 24, Author: "Anne Frank", Text: "How wonderful it is that nobody need wait a single moment before starting to improve the world."},
	{ID: 25, Author: "Stephen Hawking", Text: "Intelligence is the ability to adapt to change."},
	{ID: 26, Author: "Ralph Waldo Emerson", Text: "What lies behind us and what lies before us are tiny matters compared to what lies within us."},
	{ID: 27, Author: "Aristotle", Text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit."},
	{ID: 28, Author: "Benjamin Franklin", Text: "Tell me and I forget. Teach me and I remember. Involve me and I learn."},
	{ID: 29, Author: "C.S. Lewis", Text: "You are never too old to set another goal or to dream a new dream."},
	{ID: 30, Author: "Oprah Winfrey", Text: "The biggest adventure you can take is to live the life of your dreams."},
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

	// Serve static files from public/ for all non-API routes
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("public")))

	// Start server
	port := ":8080"
	println("Quotes API running on http://localhost" + port)
	http.ListenAndServe(port, r)
}
