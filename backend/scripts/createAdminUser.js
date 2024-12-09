require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');

/**
 * Admin user credentials
 */
const adminUserData = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123', // Remember to change this password in production
  roleName: 'Admin',
};

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existingUser = await User.findOne({ email: adminUserData.email });
    if (existingUser) {
      console.log(`Admin user already exists: ${adminUserData.email}`);
      process.exit(0);
    }

    // Find the admin role
    const adminRole = await Role.findOne({ name: adminUserData.roleName });
    if (!adminRole) {
      console.error(`❌ Role not found: ${adminUserData.roleName}`);
      process.exit(1);
    }

    const user = new User({
      name: adminUserData.name,
      email: adminUserData.email,
      password: adminUserData.password,
      role: adminRole._id,
    });

    await user.save();
    console.log(`✅ Admin user created: ${adminUserData.email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
})();
