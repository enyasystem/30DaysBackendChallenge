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
    Repo      repository.StudentRepo
    Validator *validator.Validate
}

func NewStudentHandler(repo repository.StudentRepo) *StudentHandler {
    return &StudentHandler{Repo: repo, Validator: validator.New()}
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    _ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    _ = json.NewEncoder(w).Encode(map[string]interface{}{"error": map[string]interface{}{"message": message, "code": status}})
}

func (h *StudentHandler) CreateStudent(w http.ResponseWriter, r *http.Request) {
    var in models.Student
    if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
        writeError(w, http.StatusBadRequest, "invalid json")
        return
    }
    if err := h.Validator.Struct(&in); err != nil {
        writeError(w, http.StatusBadRequest, err.Error())
        return
    }
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    created, err := h.Repo.CreateStudent(ctx, &in)
    if err != nil {
        writeError(w, http.StatusInternalServerError, "db error: "+err.Error())
        return
    }
    writeJSON(w, http.StatusCreated, created)
}

func (h *StudentHandler) GetStudent(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()
    s, err := h.Repo.GetStudent(ctx, id)
    if err != nil {
        writeError(w, http.StatusInternalServerError, "db error: "+err.Error())
        return
    }
    if s == nil {
        writeError(w, http.StatusNotFound, "not found")
        return
    }
    writeJSON(w, http.StatusOK, s)
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
        writeError(w, http.StatusInternalServerError, "db error: "+err.Error())
        return
    }

    resp := map[string]interface{}{
        "data":  students,
        "count": len(students),
        "total": total,
        "page":  page,
        "limit": limit,
    }
    writeJSON(w, http.StatusOK, resp)
}

func (h *StudentHandler) UpdateStudent(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    var in models.Student
    if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
        writeError(w, http.StatusBadRequest, "invalid json")
        return
    }

    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    updated, err := h.Repo.UpdateStudent(ctx, id, &in)
    if err != nil {
        writeError(w, http.StatusInternalServerError, "db error: "+err.Error())
        return
    }
    if updated == nil {
        writeError(w, http.StatusNotFound, "not found")
        return
    }
    writeJSON(w, http.StatusOK, updated)
}

func (h *StudentHandler) DeleteStudent(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
    defer cancel()

    ok, err := h.Repo.DeleteStudent(ctx, id)
    if err != nil {
        writeError(w, http.StatusInternalServerError, "db error: "+err.Error())
        return
    }
    if !ok {
        writeError(w, http.StatusNotFound, "not found")
        return
    }
    writeJSON(w, http.StatusOK, map[string]string{"message": "student deleted"})
}
