<?php
namespace App\Repos;

use PDO;

class PostRepo
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Return paginated posts
     * @param int $page
     * @param int $perPage
     * @return array
     */
    public function all(int $page = 1, int $perPage = 10): array
    {
        $offset = ($page - 1) * $perPage;
        // include comment_count using a correlated subquery
        $stmt = $this->pdo->prepare('SELECT p.id, p.title, p.body, p.created_at, u.username as author, (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count FROM posts p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset');
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a post and return its ID
     */
    public function create(int $userId, string $title, string $body): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO posts (user_id, title, body) VALUES (:user_id, :title, :body)');
        $stmt->execute([':user_id' => $userId, ':title' => $title, ':body' => $body]);
        return (int)$this->pdo->lastInsertId();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM posts WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM posts WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }
}
