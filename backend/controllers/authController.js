
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const RefreshToken = require('../models/RefreshToken');

/**
 * Helper to generate short-lived access token
 * @param {string} userId
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

/**
 * Helper to generate long-lived refresh token and store in DB
 * @param {string} userId
 */
const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  const refreshToken = new RefreshToken({
    token,
    user: userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  });

  await refreshToken.save();
  return token;
};

/**
 * Register a new user and issue tokens
 * @param {Object} req
 * @param {Object} res
 */
exports.register = async (req, res) => {
  const { name, email, password, roleName } = req.body;

  try {
    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(400).json({ message: 'Role not found' });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = new User({ name, email, password, role: role._id });
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Login a user and issue tokens
 * @param {Object} req
 * @param {Object} res
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Refresh the access token using a valid refresh token
 * @param {Object} req
 * @param {Object} res
 */
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Refresh token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) return res.status(400).json({ message: 'Invalid refresh token' });
    if (new Date() > storedToken.expiresAt) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      return res.status(403).json({ message: 'Refresh token expired' });
    }

    const userId = decoded.id;
    const newAccessToken = generateAccessToken(userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

/**
 * Logout by invalidating the given refresh token
 * @param {Object} req
 * @param {Object} res
 */
exports.logout = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Refresh token is required' });

  try {
    await RefreshToken.deleteOne({ token });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
