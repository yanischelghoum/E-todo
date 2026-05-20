const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const actualToken = token.startsWith('Bearer ') 
      ? token.slice(7, token.length) 
      : token;

    const decoded = jwt.verify(actualToken, process.env.SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;