<?php
// src/bootstrap.php - minimal wiring
namespace App;

use PDO;

require_once __DIR__ . '/Controllers/PostController.php';
require_once __DIR__ . '/Controllers/AuthController.php';
require_once __DIR__ . '/Controllers/CommentController.php';
require_once __DIR__ . '/Repos/PostRepo.php';
require_once __DIR__ . '/Repos/UserRepo.php';
require_once __DIR__ . '/Repos/CommentRepo.php';
require_once __DIR__ . '/Services/AuthService.php';

$container = [];

$dbPath = __DIR__ . '/../database.sqlite';
$dsn = 'sqlite:' . $dbPath;
$pdo = new PDO($dsn);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$container['pdo'] = $pdo;
$container['postRepo'] = new \App\Repos\PostRepo($pdo);
$container['userRepo'] = new \App\Repos\UserRepo($pdo);
$container['authService'] = new \App\Services\AuthService($container['userRepo']);
$container['commentRepo'] = new \App\Repos\CommentRepo($pdo);

