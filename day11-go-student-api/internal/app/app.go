package app

import (
    "context"
    "fmt"
    "time"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func NewMongoClient(ctx context.Context, uri string) (*mongo.Client, error) {
    ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
    defer cancel()
    clientOpts := options.Client().ApplyURI(uri)
    client, err := mongo.Connect(ctx, clientOpts)
    if err != nil {
        return nil, err
    }
    if err := client.Ping(ctx, nil); err != nil {
        return nil, fmt.Errorf("ping mongo: %w", err)
    }
    return client, nil
}
