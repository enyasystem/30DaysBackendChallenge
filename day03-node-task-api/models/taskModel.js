/**
 * Task Model (In-Memory)
 * Defines the structure of a Task and provides a simple in-memory store.
 * In production, replace with a database or persistent storage.
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier (UUID)
 * @property {string} title - Task title
 * @property {string} description - Task details
 * @property {string} status - Task status (e.g., 'pending', 'completed')
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

const { v4: uuidv4 } = require('uuid');

// In-memory task store
const tasks = [];

/**
 * Get all tasks
 * @returns {Task[]}
 */
function getAllTasks() {
  return tasks;
}

/**
 * Add a new task
 * @param {Object} data - Task data
 * @param {string} data.title
 * @param {string} data.description
 * @returns {Task}
 */
function addTask(data) {
  const now = new Date().toISOString();
  const task = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  return task;
}

/**
 * Get a task by ID
 * @param {string} id
 * @returns {Task|null}
 */
function getTaskById(id) {
  return tasks.find((t) => t.id === id) || null;
}

/**
 * Update a task by ID
 * @param {string} id
 * @param {Object} data - Fields to update
 * @returns {Task|null}
 */
function updateTask(id, data) {
  const task = getTaskById(id);
  if (!task) return null;
  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status;
  task.updatedAt = new Date().toISOString();
  return task;
}

/**
 * Delete a task by ID
 * @param {string} id
 * @returns {boolean} True if deleted, false if not found
 */
function deleteTask(id) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}

// Export model functions
module.exports = {
  getAllTasks,
  addTask,
  getTaskById,
  updateTask,
  deleteTask,
  // tasks (for testing/demo)
  _tasks: tasks,
};
