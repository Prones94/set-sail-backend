const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('Decoded JWT:', user);
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  if (!Array.isArray(roles)) {
    throw new Error('Roles must be an array');
  }

  return (req, res, next) => {
    console.log('Allowed roles:', roles);
    console.log('User role:', req.user.role);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
