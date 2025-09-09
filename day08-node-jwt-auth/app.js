require('dotenv').config();
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
app.use(express.json());

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`);
  next();
});

// Serve the frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// Root route: helpful message
app.get('/', (req, res) => {
  res.send(`
    <h2>Day 08 - JWT Authentication API</h2>
    <p>Available endpoints:</p>
    <ul>
      <li>POST /api/auth/register &nbsp; &nbsp; (body: { username, password })</li>
      <li>POST /api/auth/login &nbsp; &nbsp; (body: { username, password })</li>
      <li>GET /api/protected &nbsp; &nbsp; (Requires Authorization: Bearer &lt;token&gt;)</li>
    </ul>
    <p>See README.md for quick start instructions.</p>
  `);
});

// 404 handler - returns JSON for API and HTML for browser root
app.use((req, res) => {
  // If client expects JSON, send JSON error
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
  // Otherwise send a small HTML page
  res.status(404).send(`<h2>404 Not Found</h2><p>The requested resource '${req.originalUrl}' was not found on this server.</p>`);
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

// Try starting server, if port in use try next port up to max attempts
function startServer(port, attemptsLeft = 5) {
  const server = app.listen(port, () => console.log(`Server running on port ${port}`));

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use.`);
      server.close?.();
      if (attemptsLeft > 0) {
        const nextPort = port + 1;
        console.log(`Trying port ${nextPort} (${attemptsLeft - 1} attempts left)...`);
        startServer(nextPort, attemptsLeft - 1);
      } else {
        console.error('No available ports found. Please free a port or set PORT env var to a different value.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(DEFAULT_PORT);
