<?php
namespace App\Controllers;

use App\Repos\CommentRepo;

class CommentController
{
    private CommentRepo $repo;

    public function __construct(CommentRepo $repo)
    {
        $this->repo = $repo;
    }

    public function listForPost(int $postId): void
    {
        header('Content-Type: application/json');
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) ? max(1, (int)$_GET['per_page']) : 10;
        $result = $this->repo->forPostPaginated($postId, $page, $perPage);
        echo json_encode(['data' => $result['data'], 'meta' => $result['meta']]);
    }

    private function getBearerToken(): ?string
    {
        $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        if (!$hdr) return null;
        if (preg_match('/Bearer\s+(.*)$/i', $hdr, $m)) return $m[1];
        return null;
    }

    public function createForPost(int $postId, $userFinder): void
    {
        header('Content-Type: application/json');
        try {
            // auth
            $token = $this->getBearerToken();
            if (!$token) { http_response_code(401); echo json_encode(['error' => 'missing_token']); return; }
            $user = $userFinder($token);
            if (!$user) { http_response_code(401); echo json_encode(['error' => 'invalid_token']); return; }

            $data = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
            $body = trim($data['body'] ?? '');
            if ($body === '') { http_response_code(400); echo json_encode(['error' => 'validation']); return; }

            $id = $this->repo->create($postId, (int)$user['id'], $body);
            http_response_code(201);
            echo json_encode(['data' => ['id' => $id, 'body' => $body, 'author' => $user['username']]]);
        } catch (\Throwable $e) {
            http_response_code(500);
            error_log('CommentController::createForPost error: ' . $e->getMessage());
            echo json_encode(['error' => 'server_error']);
        }
    }

    public function delete(int $commentId, $userFinder): void
    {
        header('Content-Type: application/json');
        try {
            $token = $this->getBearerToken();
            if (!$token) { http_response_code(401); echo json_encode(['error' => 'missing_token']); return; }
            $user = $userFinder($token);
            if (!$user) { http_response_code(401); echo json_encode(['error' => 'invalid_token']); return; }

            $comment = $this->repo->find($commentId);
            if (!$comment) { http_response_code(404); echo json_encode(['error' => 'not_found']); return; }

            // check permission: owner of comment or owner of the post
            $postOwner = $this->repo->getPostOwner((int)$comment['post_id']);
            $isOwner = ((int)$comment['user_id'] === (int)$user['id']);
            $isPostOwner = ($postOwner !== null && (int)$postOwner === (int)$user['id']);
            if (!$isOwner && !$isPostOwner) { http_response_code(403); echo json_encode(['error' => 'forbidden']); return; }

            $this->repo->delete($commentId);
            http_response_code(204);
        } catch (\Throwable $e) {
            http_response_code(500);
            error_log('CommentController::delete error: ' . $e->getMessage());
            echo json_encode(['error' => 'server_error']);
        }
    }
}
