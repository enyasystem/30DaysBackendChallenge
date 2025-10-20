<?php
namespace App\Controllers;

use App\Repos\PostRepo;

class PostController
{
    private PostRepo $repo;

    public function __construct(PostRepo $repo)
    {
        $this->repo = $repo;
    }

    public function index(): void
    {
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) ? max(1, (int)$_GET['per_page']) : 10;

        $posts = $this->repo->all($page, $perPage);

        header('Content-Type: application/json');
        echo json_encode(['data' => $posts, 'meta' => ['page' => $page, 'per_page' => $perPage]]);
    }

    private function getBearerToken(): ?string
    {
        $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        if (!$hdr) return null;
        if (preg_match('/Bearer\s+(.*)$/i', $hdr, $m)) return $m[1];
        return null;
    }

    public function create($userFinder): void
    {
        $token = $this->getBearerToken();
        header('Content-Type: application/json');
        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'missing_token']);
            return;
        }
        $user = $userFinder($token);
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'invalid_token']);
            return;
        }
        $data = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
        $title = trim($data['title'] ?? '');
        $body = trim($data['body'] ?? '');
        if ($title === '' || $body === '') {
            http_response_code(400);
            echo json_encode(['error' => 'validation', 'details' => ['title' => 'required', 'body' => 'required']]);
            return;
        }
        $id = $this->repo->create((int)$user['id'], $title, $body);
        http_response_code(201);
        echo json_encode(['data' => ['id' => $id, 'title' => $title, 'body' => $body]]);
    }

    public function delete(int $postId, $userFinder): void
    {
        header('Content-Type: application/json');
        try {
            $token = $this->getBearerToken();
            if (!$token) { http_response_code(401); echo json_encode(['error' => 'missing_token']); return; }
            $user = $userFinder($token);
            if (!$user) { http_response_code(401); echo json_encode(['error' => 'invalid_token']); return; }

            $post = $this->repo->find($postId);
            if (!$post) { http_response_code(404); echo json_encode(['error' => 'not_found']); return; }

            if ((int)$post['user_id'] !== (int)$user['id']) { http_response_code(403); echo json_encode(['error' => 'forbidden']); return; }

            $this->repo->delete($postId);
            http_response_code(204);
        } catch (\Throwable $e) {
            http_response_code(500);
            error_log('PostController::delete error: ' . $e->getMessage());
            echo json_encode(['error' => 'server_error']);
        }
    }
}
