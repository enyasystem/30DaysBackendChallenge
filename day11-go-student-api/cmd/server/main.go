package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "time"

    "github.com/go-chi/chi/v5"

    "github.com/enyasystem/30DaysBackendChallenge/day11-go-student-api/internal/app"
    "github.com/enyasystem/30DaysBackendChallenge/day11-go-student-api/internal/handlers"
    "github.com/enyasystem/30DaysBackendChallenge/day11-go-student-api/internal/repository"
)

func main() {
    // load env or defaults
    mongoURI := os.Getenv("MONGO_URI")
    if mongoURI == "" {
        mongoURI = "mongodb://root:example@localhost:27017"
    }
    dbName := os.Getenv("MONGO_DB")
    if dbName == "" {
        dbName = "studentdb"
    }
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    ctx := context.Background()
    client, err := app.NewMongoClient(ctx, mongoURI)
    if err != nil {
        log.Fatalf("failed connect mongo: %v", err)
    }

    repo := repository.NewMongoRepo(client, dbName)
    sh := handlers.NewStudentHandler(repo)

    r := chi.NewRouter()
    r.Post("/students", sh.CreateStudent)
    r.Get("/students/{id}", sh.GetStudent)
    r.Get("/students", sh.ListStudents)
    r.Put("/students/{id}", sh.UpdateStudent)
    r.Delete("/students/{id}", sh.DeleteStudent)

    // serve docs
    r.Get("/openapi.yaml", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "./docs/openapi.yaml")
    })
    r.Get("/docs", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "./public/swagger.html")
    })

    srv := &http.Server{
        Addr:    ":" + port,
        Handler: r,
    }

    go func() {
        log.Printf("listening on :%s", port)
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %v", err)
        }
    }()

    // graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, os.Interrupt)
    <-quit
    ctxShutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctxShutdown); err != nil {
        log.Fatalf("Server Shutdown Failed:%+v", err)
    }
    log.Print("server exited properly")
}
