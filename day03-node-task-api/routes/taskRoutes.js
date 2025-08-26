/**
 * Task Routes
 * Defines API endpoints for tasks.
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /api/tasks - List all tasks
router.get('/', taskController.getTasks);

// POST /api/tasks - Create a new task
router.post('/', taskController.createTask);

// GET /api/tasks/:id - Get a single task
router.get('/:id', taskController.getTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
