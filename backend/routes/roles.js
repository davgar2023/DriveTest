const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');

/**
 * @route   POST /api/roles
 * @desc    Create a role
 */
router.post('/', auth, permission('create_role'), async (req, res) => {
  const { name, permissions } = req.body;

  try {
    const perms = await Permission.find({ name: { $in: permissions } });
    const role = new Role({ name, permissions: perms.map((p) => p._id) });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/roles
 * @desc    Get all roles
 */
router.get('/', auth, permission('view_roles'), async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
