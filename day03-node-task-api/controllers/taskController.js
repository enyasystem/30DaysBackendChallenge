/**
 * Task Controller
 * Handles business logic for task endpoints.
 */

const TaskModel = require('../models/taskModel');

/**
 * Get all tasks
 * @route GET /api/tasks
 */
const getTasks = (req, res) => {
  const tasks = TaskModel.getAllTasks();
  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
};

/**
 * Create a new task
 * @route POST /api/tasks
 */
const createTask = (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Title and description are required.' });
  }
  const task = TaskModel.addTask({ title, description });
  res.status(201).json({ success: true, data: task });
};

/**
 * Get a single task by ID
 * @route GET /api/tasks/:id
 */
const getTask = (req, res) => {
  const task = TaskModel.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found.' });
  }
  res.json({ success: true, data: task });
};

/**
 * Update a task by ID
 * @route PUT /api/tasks/:id
 */
const updateTask = (req, res) => {
  const task = TaskModel.updateTask(req.params.id, req.body);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found.' });
  }
  res.json({ success: true, data: task });
};

/**
 * Delete a task by ID
 * @route DELETE /api/tasks/:id
 */
const deleteTask = (req, res) => {
  const deleted = TaskModel.deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Task not found.' });
  }
  res.json({ success: true, message: 'Task deleted.' });
};

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
