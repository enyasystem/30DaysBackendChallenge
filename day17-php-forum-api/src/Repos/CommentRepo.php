<?php
namespace App\Repos;

use PDO;

class CommentRepo
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function forPost(int $postId): array
    {
        // default: no pagination
        $stmt = $this->pdo->prepare('SELECT c.id, c.body, c.created_at, u.username as author FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = :post_id ORDER BY c.created_at ASC');
        $stmt->execute([':post_id' => $postId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function forPostPaginated(int $postId, int $page = 1, int $perPage = 10): array
    {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->pdo->prepare('SELECT c.id, c.body, c.created_at, u.username as author FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = :post_id ORDER BY c.created_at ASC LIMIT :limit OFFSET :offset');
        $stmt->bindValue(':post_id', $postId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $countStmt = $this->pdo->prepare('SELECT COUNT(*) as cnt FROM comments WHERE post_id = :post_id');
        $countStmt->execute([':post_id' => $postId]);
        $total = (int)$countStmt->fetch(PDO::FETCH_ASSOC)['cnt'];
        return ['data' => $items, 'meta' => ['page' => $page, 'per_page' => $perPage, 'total' => $total]];
    }

    public function create(int $postId, int $userId, string $body): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO comments (post_id, user_id, body) VALUES (:post_id, :user_id, :body)');
        $stmt->execute([':post_id' => $postId, ':user_id' => $userId, ':body' => $body]);
        return (int)$this->pdo->lastInsertId();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM comments WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : $row;
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM comments WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }

    public function getPostOwner(int $postId): ?int
    {
        $stmt = $this->pdo->prepare('SELECT user_id FROM posts WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $postId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? (int)$row['user_id'] : null;
    }
}
