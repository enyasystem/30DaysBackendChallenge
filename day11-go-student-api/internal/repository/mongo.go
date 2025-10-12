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

// StudentRepo defines repository operations used by handlers (for easier testing).
type StudentRepo interface {
	CreateStudent(ctx context.Context, s *models.Student) (*models.Student, error)
	GetStudent(ctx context.Context, id string) (*models.Student, error)
	ListStudents(ctx context.Context, filter interface{}, limit, skip int64) ([]*models.Student, int64, error)
	UpdateStudent(ctx context.Context, id string, in *models.Student) (*models.Student, error)
	DeleteStudent(ctx context.Context, id string) (bool, error)
}

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

func (r *MongoRepo) ListStudents(ctx context.Context, filter interface{}, limit, skip int64) ([]*models.Student, int64, error) {
	coll := r.db.Collection("students")

	// total count for the filter
	total, err := coll.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	findOpts := options.Find()
	if limit > 0 {
		findOpts.SetLimit(limit)
	}
	if skip > 0 {
		findOpts.SetSkip(skip)
	}
	// sort newest first
	findOpts.SetSort(bson.D{{Key: "created_at", Value: -1}})

	cur, err := coll.Find(ctx, filter, findOpts)
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var results []*models.Student
	for cur.Next(ctx) {
		var raw bson.M
		if err := cur.Decode(&raw); err != nil {
			return nil, 0, err
		}
		var s models.Student
		if oid, ok := raw["_id"].(primitive.ObjectID); ok {
			s.ID = oid.Hex()
		}
		delete(raw, "_id")
		b, err := bson.Marshal(raw)
		if err != nil {
			return nil, 0, err
		}
		if err := bson.Unmarshal(b, &s); err != nil {
			return nil, 0, err
		}
		results = append(results, &s)
	}
	if err := cur.Err(); err != nil {
		return nil, 0, err
	}
	return results, total, nil
}

func (r *MongoRepo) UpdateStudent(ctx context.Context, id string, in *models.Student) (*models.Student, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	coll := r.db.Collection("students")

	// build update document only for non-zero fields
	update := bson.M{"$set": bson.M{}}
	set := update["$set"].(bson.M)

	if in.FirstName != "" {
		set["first_name"] = in.FirstName
	}
	if in.LastName != "" {
		set["last_name"] = in.LastName
	}
	if in.Email != "" {
		set["email"] = in.Email
	}
	if in.DOB != "" {
		set["dob"] = in.DOB
	}
	// boolean zero value is false; to allow toggling enrolled, always set
	set["enrolled"] = in.Enrolled

	set["updated_at"] = time.Now().UTC()

	if len(set) == 0 {
		// nothing to update
		return r.GetStudent(ctx, id)
	}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var raw bson.M
	err = coll.FindOneAndUpdate(ctx, bson.M{"_id": oid}, update, opts).Decode(&raw)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	var s models.Student
	if oid2, ok := raw["_id"].(primitive.ObjectID); ok {
		s.ID = oid2.Hex()
	}
	delete(raw, "_id")
	b, err := bson.Marshal(raw)
	if err != nil {
		return nil, err
	}
	if err := bson.Unmarshal(b, &s); err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *MongoRepo) DeleteStudent(ctx context.Context, id string) (bool, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return false, err
	}
	coll := r.db.Collection("students")
	res, err := coll.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return false, err
	}
	if res.DeletedCount == 0 {
		return false, nil
	}
	return true, nil
}
