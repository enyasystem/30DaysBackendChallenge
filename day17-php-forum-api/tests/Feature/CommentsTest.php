<?php
use App\Repos\CommentRepo;
use App\Repos\UserRepo;

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../../src/Repos/CommentRepo.php';
require_once __DIR__ . '/../../src/Repos/UserRepo.php';

class CommentsTest extends \PHPUnit\Framework\TestCase
{
    private $pdo;

    protected function setUp(): void
    {
        $this->pdo = $GLOBALS['pdo'];
    }

    public function testCreateAndListComments()
    {
        $users = new UserRepo($this->pdo);
        $comments = new CommentRepo($this->pdo);
        $uid = $users->create('ctest', password_hash('pass', PASSWORD_DEFAULT));
        $pid = 1; // assume post exists from bootstrap
        $cid = $comments->create($pid, $uid, 'hello');
        $list = $comments->forPost($pid);
        $this->assertNotEmpty($list);
        $found = array_filter($list, fn($c) => $c['id'] == $cid);
        $this->assertNotEmpty($found);
    }
}
