<?php
session_start();
if (empty($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}
if (isset($_GET['logout'])) {
    session_unset();
    session_destroy();
    header('Location: login.php');
    exit;
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Dashboard</title>
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
    <section class="card fade-in">
      <h2>Dashboard</h2>
      <p>Welcome, <?=htmlspecialchars($_SESSION['user'])?> — you are logged in.</p>
      <p><a class="btn btn-outline" href="?logout=1">Logout</a></p>
      <p><a class="muted" href="index.php">Home</a></p>
    </section>
  </main>
  <script src="assets/app.js"></script>
</body>
</html>
