// Simple in-memory user store. Replace with DB in production.
const users = [];

function findByUsername(username) {
  return users.find(u => u.username === username);
}

function createUser(user) {
  users.push(user);
  return user;
}

module.exports = { users, findByUsername, createUser };
