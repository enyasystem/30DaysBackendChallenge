/**
 * Task Manager API - Express Server Entry Point
 *
 * This file initializes the Express application, applies global middleware,
 * and sets up the base route. All advanced logic should be organized in the
 * routes, controllers, models, and middlewares folders for maintainability.
 *
 * @author Enya Elvis
 * @date 2025-08-26
 */

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Create Express app
const app = express();


// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Log HTTP requests

// Serve static frontend
app.use(express.static('public'));

// Health check route
app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the Task Manager API!',
		status: 'OK',
		timestamp: new Date().toISOString(),
	});
});

// Mount API routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Global error handler (best practice)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		error: err.message || 'Internal Server Error',
	});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Task Manager API server running on port ${PORT}`);
});
