<?php
session_start();
// login.php - verify username and password from users.txt
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === '' || $password === '') {
        $error = 'Provide username and password.';
    } else {
        $users = @file('users.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        $found = false;
        foreach ($users as $line) {
            [$u, $hash] = explode('|', $line) + [1 => ''];
            if ($u === $username && password_verify($password, trim($hash))) {
                $found = true;
                break;
            }
        }
        if ($found) {
            $_SESSION['user'] = $username;
            header('Location: dashboard.php');
            exit;
        } else {
            $error = 'Invalid credentials.';
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Login</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
        <a class="skip-link" href="#main">Skip to content</a>
            <header class="site-header">
                <div class="container">
                    <a class="brand" href="index.php">Day 1 - PHP Login</a>
                    <button class="theme-toggle" aria-label="Toggle theme" aria-pressed="false"><img src="assets/icon-theme.svg" alt="theme"></button>
                </div>
            </header>
        <main id="main" class="container">
            <section class="card auth fade-in">
                <h2>Sign in</h2>
                <?php if (!empty($error)): ?>
                    <p role="alert" class="error" id="form-error"><?=htmlspecialchars($error)?></p>
                <?php endif; ?>
                <form method="POST" data-validate="true" aria-describedby="form-error">
                    <label for="username">Username</label>
                    <input id="username" type="text" name="username" placeholder="Username" required>

                    <label for="password">Password</label>
                    <div class="field-row">
                        <input id="password" type="password" name="password" placeholder="Password" required>
                        <button type="button" class="toggle-password" data-target="password" aria-pressed="false">Show</button>
                    </div>

                    <p><button class="btn" type="submit">Login</button></p>
                    <p class="form-error error" style="display:none" tabindex="-1"></p>
                </form>
                <p class="muted">Don't have an account? <a href="register.php">Register</a></p>
            </section>
        </main>
        <script src="assets/app.js"></script>
    </body>
    </html>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Hello</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="">
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        
        <script src="" async defer></script>
    </body>
</html>
