<?php
// Simple homepage with links to auth pages
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Day 1 - PHP Login</title>
	<link rel="stylesheet" href="assets/style.css">
</head>
<body>
	<header class="site-header">
		<div class="container">
			<a class="brand" href="index.php">Day 1 - PHP Login</a>
			<nav class="nav">
				<a href="register.php">Register</a>
				<a href="login.php">Login</a>
				<a href="dashboard.php">Dashboard</a>
				<button class="theme-toggle" aria-label="Toggle theme" aria-pressed="false"><img src="assets/icon-theme.svg" alt="theme"></button>
			</nav>
		</div>
	</header>

	<main class="container">
		<section class="hero card">
			<div class="hero-grid">
				<div>
					<h1>Hello Elvis 👋</h1>
					<p>Welcome to Day 1 Project — a minimal PHP file-based auth demo built for learning and fast prototyping.</p>
					<p class="muted">Register an account and explore the protected dashboard. This demo uses secure password hashing and PHP sessions.</p>
					<p>
						<a class="btn" href="register.php">Register</a>
						<a class="btn btn-outline" href="login.php">Login</a>
					</p>
					<div class="features">
						<div class="feature">
							<img class="icon" src="assets/icon-lock.svg" alt="secure">
							<div>
								<h4>Secure</h4>
								<p>Passwords are hashed using PHP's password_hash.</p>
							</div>
						</div>
						<div class="feature">
							<img class="icon" src="assets/icon-speed.svg" alt="fast">
							<div>
								<h4>Lightweight</h4>
								<p>No database required — simple file-based storage for learning.</p>
							</div>
						</div>
						<div class="feature">
							<img class="icon" src="assets/icon-shield.svg" alt="privacy">
							<div>
								<h4>Private</h4>
								<p>Sessions protect the dashboard and ensure only logged-in users can access it.</p>
							</div>
						</div>
					</div>
				</div>
				<div>
					<img class="hero-illustration" src="assets/illustration.svg" alt="illustration">
				</div>
			</div>
		</section>
	</main>

	<footer class="site-footer">
		<div class="container">Built for 30DaysBackend Challenge</div>
	</footer>
	<script src="assets/app.js"></script>
	</body>
	</html>
