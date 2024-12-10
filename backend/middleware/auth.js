const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user  = await User.findById(decoded.id).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });



    if (!user || !user.role) {
      return res.status(403).json({ message: 'User or role not found' });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access Denied: Token Expired' });
    }
    res.status(400).json({ message: 'Access Denied: Invalid Token' });

  }
};
