package models

import "time"

type Student struct {
    ID        string    `json:"id" bson:"_id,omitempty"`
    FirstName string    `json:"first_name" bson:"first_name" validate:"required"`
    LastName  string    `json:"last_name" bson:"last_name" validate:"required"`
    Email     string    `json:"email" bson:"email" validate:"required,email"`
    DOB       string    `json:"dob,omitempty" bson:"dob,omitempty"`
    Enrolled  bool      `json:"enrolled" bson:"enrolled"`
    CreatedAt time.Time `json:"created_at" bson:"created_at"`
    UpdatedAt time.Time `json:"updated_at" bson:"updated_at"`
}
