package handlers

import (
    "bytes"
    "context"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
    "time"

    "github.com/go-chi/chi/v5"
    "github.com/stretchr/testify/require"

    "github.com/enyasystem/30DaysBackendChallenge/day11-go-student-api/internal/models"
)

// minimal fake repo implementing repository.StudentRepo
type fakeRepo struct{
    students map[string]*models.Student
}

func newFakeRepo() *fakeRepo { return &fakeRepo{students: make(map[string]*models.Student)} }

func (f *fakeRepo) CreateStudent(ctx context.Context, s *models.Student) (*models.Student, error) {
    s.ID = "1"
    s.CreatedAt = time.Now().UTC()
    s.UpdatedAt = s.CreatedAt
    f.students[s.ID] = s
    return s, nil
}
func (f *fakeRepo) GetStudent(ctx context.Context, id string) (*models.Student, error) { return f.students[id], nil }
func (f *fakeRepo) ListStudents(ctx context.Context, filter interface{}, limit, skip int64) ([]*models.Student, int64, error) {
    var res []*models.Student
    for _, s := range f.students { res = append(res, s) }
    return res, int64(len(res)), nil
}
func (f *fakeRepo) UpdateStudent(ctx context.Context, id string, in *models.Student) (*models.Student, error) {
    s, ok := f.students[id]
    if !ok { return nil, nil }
    if in.FirstName != "" { s.FirstName = in.FirstName }
    s.Enrolled = in.Enrolled
    s.UpdatedAt = time.Now().UTC()
    return s, nil
}
func (f *fakeRepo) DeleteStudent(ctx context.Context, id string) (bool, error) { if _, ok := f.students[id]; ok { delete(f.students,id); return true,nil }; return false,nil }

func TestCreateUpdateDeleteStudent(t *testing.T) {
    repo := newFakeRepo()
    h := NewStudentHandler(repo)

    // create
    rr := httptest.NewRecorder()
    body := bytes.NewBufferString(`{"first_name":"A","last_name":"B","email":"a@b.com","enrolled":true}`)
    req := httptest.NewRequest(http.MethodPost, "/students", body)
    h.CreateStudent(rr, req)
    require.Equal(t, http.StatusCreated, rr.Code)
    var created models.Student
    json.Unmarshal(rr.Body.Bytes(), &created)
    require.Equal(t, "1", created.ID)

    // update
    rr = httptest.NewRecorder()
    body = bytes.NewBufferString(`{"first_name":"Updated","enrolled":false}`)
    req = httptest.NewRequest(http.MethodPut, "/students/1", body)
    // chi router used for URL param
    r := chi.NewRouter()
    r.Put("/students/{id}", h.UpdateStudent)
    r.ServeHTTP(rr, req)
    require.Equal(t, http.StatusOK, rr.Code)
    var updated models.Student
    json.Unmarshal(rr.Body.Bytes(), &updated)
    require.Equal(t, "Updated", updated.FirstName)
    require.Equal(t, false, updated.Enrolled)

    // delete
    rr = httptest.NewRecorder()
    req = httptest.NewRequest(http.MethodDelete, "/students/1", nil)
    r = chi.NewRouter()
    r.Delete("/students/{id}", h.DeleteStudent)
    r.ServeHTTP(rr, req)
    require.Equal(t, http.StatusOK, rr.Code)
}
