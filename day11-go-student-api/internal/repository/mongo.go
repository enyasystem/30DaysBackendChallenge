package repository

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

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

func (r *MongoRepo) ListStudents(ctx context.Context) ([]*models.Student, error) {
	coll := r.db.Collection("students")
	cur, err := coll.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	var results []*models.Student
	for cur.Next(ctx) {
		var s models.Student
		if err := cur.Decode(&s); err != nil {
			return nil, err
		}
		// ensure ID is set if document has ObjectID
		if oid, ok := s.ID.(string); ok && oid == "" {
			// no-op: keep existing ID handling below
		}
		results = append(results, &s)
	}
	if err := cur.Err(); err != nil {
		return nil, err
	}
	// set IDs for any docs where ID may be empty — attempt to read _id separately
	// (documents decoded into struct with ID field empty if bson tag mismatched)
	// simple approach: iterate and if ID empty, query raw doc to get _id
	for i, s := range results {
		if s.ID == "" {
			// try to find document by unique fields
			var raw bson.M
			filter := bson.M{"email": s.Email}
			if err := coll.FindOne(ctx, filter).Decode(&raw); err == nil {
				if oid, ok := raw["_id"].(primitive.ObjectID); ok {
					s.ID = oid.Hex()
					results[i] = s
				}
			}
		}
	}
	return results, nil
}
