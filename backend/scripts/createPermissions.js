require('dotenv').config();
const mongoose = require('mongoose');
const Permission = require('../models/Permission');

/**
 * List of permissions to create.
 */
const permissions = [
  'create_report',
  'view_reports',
  'edit_report',
  'delete_report',
  'upload_file',
  'view_files',
  'edit_file',
  'delete_file',
  'manage_roles',
  'manage_users',
  // Add more permissions as needed
];

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const permissionName of permissions) {
      const existingPermission = await Permission.findOne({ name: permissionName });
      if (!existingPermission) {
        const permission = new Permission({ name: permissionName });
        await permission.save();
        console.log(`Created permission: ${permissionName}`);
      } else {
        console.log(`Permission already exists: ${permissionName}`);
      }
    }

    console.log('✅ Permissions setup completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up permissions:', error);
    process.exit(1);
  }
})();
