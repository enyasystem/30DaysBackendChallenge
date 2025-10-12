package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "time"

    "github.com/go-chi/chi/v5"
    "github.com/go-playground/validator/v10"

    "github.com/enyasystem/30DaysBackendChallenge/day11-go-student-api/internal/models"
    "github.com/enyasystem/30DaysBackendChallenge/day11-go-student-api/internal/repository"
)

type StudentHandler struct {
    Repo      *repository.MongoRepo
    Validator *validator.Validate
}

func NewStudentHandler(repo *repository.MongoRepo) *StudentHandler {
    return &StudentHandler{Repo: repo, Validator: validator.New()}
}

func (h *StudentHandler) CreateStudent(w http.ResponseWriter, r *http.Request) {
    var in models.Student
    if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
        http.Error(w, "invalid json", http.StatusBadRequest)
        return
    }
    if err := h.Validator.Struct(&in); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    created, err := h.Repo.CreateStudent(ctx, &in)
    if err != nil {
        http.Error(w, "db error: "+err.Error(), http.StatusInternalServerError)
        return
    }
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(created)
}

func (h *StudentHandler) GetStudent(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()
    s, err := h.Repo.GetStudent(ctx, id)
    if err != nil {
        http.Error(w, "db error", http.StatusInternalServerError)
        return
    }
    if s == nil {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }
    json.NewEncoder(w).Encode(s)
}

func (h *StudentHandler) ListStudents(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    students, err := h.Repo.ListStudents(ctx)
    if err != nil {
        http.Error(w, "db error: "+err.Error(), http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(map[string]interface{}{"data": students, "count": len(students)})
}
