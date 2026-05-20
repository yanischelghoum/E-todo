const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promiseDb } = require('../config/db');  

const loginMiddleware = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Bad parameter' });
        }

        const [users] = await promiseDb.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        const user = users[0];

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,   
        };

        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

module.exports = loginMiddleware;