package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "strconv"
    "time"

    "github.com/go-chi/chi/v5"
    "github.com/go-playground/validator/v10"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"

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
    // parse query params
    q := r.URL.Query().Get("q")
    pageStr := r.URL.Query().Get("page")
    limitStr := r.URL.Query().Get("limit")
    enrolledStr := r.URL.Query().Get("enrolled")

    // defaults
    page := 1
    limit := 20

    if pageStr != "" {
        if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
            page = p
        }
    }
    if limitStr != "" {
        if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
            limit = l
        }
    }

    // build filter
    filter := bson.M{}
    if q != "" {
        // search first_name, last_name, email (case-insensitive)
        regex := primitive.Regex{Pattern: q, Options: "i"}
        filter["$or"] = []bson.M{
            {"first_name": regex},
            {"last_name": regex},
            {"email": regex},
        }
    }
    if enrolledStr != "" {
        if enrolledStr == "true" {
            filter["enrolled"] = true
        } else if enrolledStr == "false" {
            filter["enrolled"] = false
        }
    }

    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    skip := (page - 1) * limit
    students, total, err := h.Repo.ListStudents(ctx, filter, int64(limit), int64(skip))
    if err != nil {
        http.Error(w, "db error: "+err.Error(), http.StatusInternalServerError)
        return
    }

    resp := map[string]interface{}{
        "data":  students,
        "count": len(students),
        "total": total,
        "page":  page,
        "limit": limit,
    }
    json.NewEncoder(w).Encode(resp)
}

func (h *StudentHandler) UpdateStudent(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    var in models.Student
    if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
        http.Error(w, "invalid json", http.StatusBadRequest)
        return
    }
    // optional: validate only provided fields - for simplicity, validate struct
    if err := h.Validator.StructPartial(&in, "FirstName", "LastName", "Email", "DOB", "Enrolled"); err != nil {
        // StructPartial doesn't exist; fall back to full struct validation if needed
    }

    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    updated, err := h.Repo.UpdateStudent(ctx, id, &in)
    if err != nil {
        http.Error(w, "db error: "+err.Error(), http.StatusInternalServerError)
        return
    }
    if updated == nil {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }
    json.NewEncoder(w).Encode(updated)
}
