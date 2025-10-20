<?php
namespace App\Repos;

use PDO;

class UserRepo
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function create(string $username, string $passwordHash): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO users (username, password_hash) VALUES (:username, :password_hash)');
        $stmt->execute([':username' => $username, ':password_hash' => $passwordHash]);
        return (int)$this->pdo->lastInsertId();
    }

    public function findByUsername(string $username): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE username = :username LIMIT 1');
        $stmt->execute([':username' => $username]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public function setToken(int $userId, string $token): void
    {
        // Ensure the api_token column exists. Use PRAGMA table_info to check and ALTER TABLE if missing.
        $stmt = $this->pdo->prepare("PRAGMA table_info('users')");
        $stmt->execute();
        $cols = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $names = array_map(function ($c) { return $c['name']; }, $cols);
        if (!in_array('api_token', $names, true)) {
            // SQLite supports ALTER TABLE ADD COLUMN <name> <type>
            $this->pdo->exec('ALTER TABLE users ADD COLUMN api_token TEXT');
        }

        $stmt = $this->pdo->prepare('UPDATE users SET api_token = :token WHERE id = :id');
        $stmt->execute([':token' => $token, ':id' => $userId]);
    }

    public function findByToken(string $token): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE api_token = :token LIMIT 1');
        $stmt->execute([':token' => $token]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }
}
