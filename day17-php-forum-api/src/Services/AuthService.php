<?php
namespace App\Services;

use App\Repos\UserRepo;

class AuthService
{
    private UserRepo $users;

    public function __construct(UserRepo $users)
    {
        $this->users = $users;
    }

    public function register(string $username, string $password): array
    {
        if ($this->users->findByUsername($username)) {
            throw new \RuntimeException('username_taken');
        }
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $id = $this->users->create($username, $hash);
        return ['id' => $id, 'username' => $username];
    }

    public function login(string $username, string $password): string
    {
        $user = $this->users->findByUsername($username);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new \RuntimeException('invalid_credentials');
        }
        $token = bin2hex(random_bytes(16));
        $this->users->setToken((int)$user['id'], $token);
        return $token;
    }
}
