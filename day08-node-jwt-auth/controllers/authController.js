const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByUsername, createUser } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  if (findByUsername(username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = { username, password: hashed };
  createUser(user);
  return res.status(201).json({ message: 'User registered' });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  const user = findByUsername(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  return res.json({ token });
}

module.exports = { register, login };
