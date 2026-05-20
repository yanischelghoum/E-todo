const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promiseDb } = require('../config/db');

const registerMiddleware = async (req, res, next) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    if (!username || !firstname || !lastname || !email || !password) {
      return res.status(400).json({ msg: 'Bad parameter' });
    }

    const [existingUsers] = await promiseDb.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ msg: 'Account already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await promiseDb.query(
      'INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
      [username, firstname, lastname, email, hashedPassword]
    );

    const payload = {
      id: result.insertId,
      email: email
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' });

    res.status(201).json({ token });

  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = registerMiddleware;