const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const TOKEN_EXPIRES_SECONDS = 2 * 60 * 60; // 2h

const makeToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      username: user.username,
      role: 'user',
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_SECONDS }
  );

const register = async (req, res) => {
  const { username, password } = req.body || {};

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Auth is not configured on the server' });
  }

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    const existing = await User.findOne({ username }).lean();
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });
    const token = makeToken(user);

    res.status(201).json({
      token,
      tokenType: 'Bearer',
      expiresIn: TOKEN_EXPIRES_SECONDS,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error('Failed to register user', error);
    res.status(500).json({ message: 'Unable to register' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body || {};

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Auth is not configured on the server' });
  }

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = makeToken(user);
    res.status(200).json({
      token,
      tokenType: 'Bearer',
      expiresIn: TOKEN_EXPIRES_SECONDS,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error('Failed to login', error);
    res.status(500).json({ message: 'Unable to login' });
  }
};

const logout = (req, res) => {
  // Stateless JWT logout is handled client-side by discarding the token.
  res.status(200).json({ message: 'Logged out' });
};

module.exports = { register, login, logout };
