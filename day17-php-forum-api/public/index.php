<?php
// public/index.php - tiny front controller / router
require_once __DIR__ . '/../src/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple routing for learning purposes
// Serve a minimal frontend app at /
if ($method === 'GET' && ($path === '/' || $path === '/app')) {
    header('Content-Type: text/html; charset=utf-8');
    echo file_get_contents(__DIR__ . '/app.html');
    exit;
}

// Serve static assets (very small router-friendly handling)
if ($method === 'GET' && $path === '/app.js') {
    header('Content-Type: application/javascript');
    echo file_get_contents(__DIR__ . '/app.js');
    exit;
}

if ($method === 'GET' && $path === '/style.css') {
    header('Content-Type: text/css');
    echo file_get_contents(__DIR__ . '/style.css');
    exit;
}

if ($method === 'GET' && preg_match('#^/posts$#', $path)) {
    $controller = new \App\Controllers\PostController($container['postRepo']);
    $controller->index();
    exit;
}

if ($method === 'POST' && preg_match('#^/register$#', $path)) {
    $controller = new \App\Controllers\AuthController($container['authService']);
    $controller->register();
    exit;
}

if ($method === 'POST' && preg_match('#^/login$#', $path)) {
    $controller = new \App\Controllers\AuthController($container['authService']);
    $controller->login();
    exit;
}

if ($method === 'POST' && preg_match('#^/posts$#', $path)) {
    $controller = new \App\Controllers\PostController($container['postRepo']);
    // userFinder closure uses userRepo from container
    $userFinder = function ($token) use ($container) {
        return $container['userRepo']->findByToken($token);
    };
    $controller->create($userFinder);
    exit;
}

// current user lookup
if ($method === 'GET' && preg_match('#^/me$#', $path)) {
    header('Content-Type: application/json');
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
    if (!$hdr || !preg_match('/Bearer\s+(.*)$/i', $hdr, $m)) { http_response_code(401); echo json_encode(['error' => 'missing_token']); exit; }
    $user = $container['userRepo']->findByToken($m[1]);
    if (!$user) { http_response_code(401); echo json_encode(['error'=>'invalid_token']); exit; }
    echo json_encode(['data' => ['id' => $user['id'], 'username' => $user['username']]]);
    exit;
}

// comments
if (preg_match('#^/posts/(\d+)/comments$#', $path, $m)) {
    $postId = (int)$m[1];
    if ($method === 'GET') {
        $controller = new \App\Controllers\CommentController($container['commentRepo']);
        $controller->listForPost($postId);
        exit;
    }
    if ($method === 'POST') {
        $controller = new \App\Controllers\CommentController($container['commentRepo']);
        $userFinder = function ($token) use ($container) { return $container['userRepo']->findByToken($token); };
        $controller->createForPost($postId, $userFinder);
        exit;
    }
}

// delete comment
if ($method === 'DELETE' && preg_match('#^/comments/(\d+)$#', $path, $m)) {
    $commentId = (int)$m[1];
    // debug: log request headers to server log to diagnose missing Authorization
    error_log('DELETE /comments/' . $commentId . ' headers: ' . json_encode(getallheaders()));
    $controller = new \App\Controllers\CommentController($container['commentRepo']);
    $userFinder = function ($token) use ($container) { return $container['userRepo']->findByToken($token); };
    $controller->delete($commentId, $userFinder);
    exit;
}

// delete post
if ($method === 'DELETE' && preg_match('#^/posts/(\d+)$#', $path, $m)) {
    $postId = (int)$m[1];
    error_log('DELETE /posts/' . $postId . ' headers: ' . json_encode(getallheaders()));
    $controller = new \App\Controllers\PostController($container['postRepo']);
    $userFinder = function ($token) use ($container) { return $container['userRepo']->findByToken($token); };
    $controller->delete($postId, $userFinder);
    exit;
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not Found']);
