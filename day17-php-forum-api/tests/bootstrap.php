<?php
// tests/bootstrap.php - set up an in-memory SQLite DB for tests
$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec(file_get_contents(__DIR__ . '/../migrations/001_create_tables.sql'));

// seed a user and a post for a happy path
$pdo->exec("INSERT INTO users (username, password_hash) VALUES ('test', 'hash')");
$pdo->exec("INSERT INTO posts (user_id, title, body) VALUES (1, 'hello', 'world')");

// expose $pdo globally for tests to use
$GLOBALS['pdo'] = $pdo;
