<?php
namespace App\Controllers;

use App\Services\AuthService;

class AuthController
{
    private AuthService $service;

    public function __construct(AuthService $service)
    {
        $this->service = $service;
    }

    private function getJsonInput(): array
    {
        $raw = file_get_contents('php://input');
        return json_decode($raw ?: '{}', true) ?: [];
    }

    public function register(): void
    {
        $data = $this->getJsonInput();
        header('Content-Type: application/json');
        try {
            $res = $this->service->register($data['username'] ?? '', $data['password'] ?? '');
            http_response_code(201);
            echo json_encode(['data' => $res]);
        } catch (\RuntimeException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function login(): void
    {
        $data = $this->getJsonInput();
        header('Content-Type: application/json');
        try {
            $token = $this->service->login($data['username'] ?? '', $data['password'] ?? '');
            echo json_encode(['data' => ['token' => $token]]);
        } catch (\RuntimeException $e) {
            http_response_code(401);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
