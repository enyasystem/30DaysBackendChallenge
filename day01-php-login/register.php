<?php
// register.php - simple registration that appends username|hashed_password to users.txt
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm'] ?? '';

    if ($username === '' || $password === '') {
        $error = 'Please provide username and password.';
    } elseif ($password !== $confirm) {
        $error = 'Passwords do not match.';
    } else {
        // basic username uniqueness check
        $users = @file('users.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        $exists = false;
        foreach ($users as $line) {
            [$u] = explode('|', $line);
            if ($u === $username) { $exists = true; break; }
        }
        if ($exists) {
            $error = 'Username already exists. Choose another.';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $data = $username . '|' . $hash . PHP_EOL;
            if (file_put_contents('users.txt', $data, FILE_APPEND | LOCK_EX) === false) {
                $error = 'Could not write to users.txt. Check permissions.';
            } else {
                $success = "✅ Registration successful. <a href='login.php'>Login here</a>";
            }
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Register</title>
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
      <h2>Create an account</h2>
      <?php if (!empty($error)): ?>
        <p role="alert" class="error" id="form-error"><?=htmlspecialchars($error)?></p>
      <?php endif; ?>
      <?php if (!empty($success)): ?>
        <p class="success"><?= $success ?></p>
      <?php else: ?>
      <form method="POST" data-validate="true" aria-describedby="form-error">
        <label for="username">Username</label>
        <input id="username" type="text" name="username" placeholder="Username" required>

        <label for="password">Password</label>
        <div class="field-row">
          <input id="password" type="password" name="password" placeholder="Password" required>
          <button type="button" class="toggle-password" data-target="password" aria-pressed="false">Show</button>
        </div>

        <label for="confirm">Confirm password</label>
        <input id="confirm" type="password" name="confirm" placeholder="Confirm password" required>

        <p><button class="btn" type="submit">Register</button></p>
        <p class="form-error error" style="display:none" tabindex="-1"></p>
      </form>
      <?php endif; ?>
      <p class="muted">Already have an account? <a href="login.php">Login</a></p>
    </section>
  </main>
  <script src="assets/app.js"></script>
</body>
</html>
