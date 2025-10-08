package repository

import (
    "context"
    "errors"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"

    "github.com/enyasystem/30DaysBackendChallenge/day11-go-student-api/internal/models"
)

type MongoRepo struct {
    db *mongo.Database
}

func NewMongoRepo(client *mongo.Client, dbName string) *MongoRepo {
    return &MongoRepo{db: client.Database(dbName)}
}

func (r *MongoRepo) CreateStudent(ctx context.Context, s *models.Student) (*models.Student, error) {
    s.CreatedAt = time.Now().UTC()
    s.UpdatedAt = s.CreatedAt

    coll := r.db.Collection("students")
    res, err := coll.InsertOne(ctx, s)
    if err != nil {
        return nil, err
    }
    id := res.InsertedID.(primitive.ObjectID)
    s.ID = id.Hex()
    return s, nil
}

func (r *MongoRepo) GetStudent(ctx context.Context, id string) (*models.Student, error) {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, err
    }
    var s models.Student
    coll := r.db.Collection("students")
    err = coll.FindOne(ctx, bson.M{"_id": oid}).Decode(&s)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, nil
        }
        return nil, err
    }
    s.ID = oid.Hex()
    return &s, nil
}
