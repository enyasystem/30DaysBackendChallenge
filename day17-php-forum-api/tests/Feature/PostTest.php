<?php
use App\Repos\PostRepo;

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../src/Repos/PostRepo.php';

$pdo = $GLOBALS['pdo'];
$repo = new PostRepo($pdo);
$posts = $repo->all(1, 10);

if (count($posts) !== 1) {
    echo "Test failed: expected 1 post, got " . count($posts) . "\n";
    exit(1);
}

echo "Test passed: posts listing returned 1 post\n";
