<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../src/Repos/UserRepo.php';
require_once __DIR__ . '/../../src/Services/AuthService.php';

$pdo = $GLOBALS['pdo'];
$users = new \App\Repos\UserRepo($pdo);
$auth = new \App\Services\AuthService($users);

// register
$res = $auth->register('alice', 'password123');
if (!isset($res['id'])) {
    echo "Register failed\n";
    exit(1);
}

// login
$token = $auth->login('alice', 'password123');
if (empty($token)) {
    echo "Login failed\n";
    exit(1);
}

// lookup by token
$found = $users->findByToken($token);
if (!$found || $found['username'] !== 'alice') {
    echo "Token lookup failed\n";
    exit(1);
}

echo "Auth tests passed\n";
