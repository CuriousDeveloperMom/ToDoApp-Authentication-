const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req: any, res: any, next: any) {
  // Get token from header
  const token = req.header('X-auth-Token');
  console.log('In Auth!');
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
