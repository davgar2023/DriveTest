
require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

/**
 * List of roles to create, with associated permissions.
 */
const roles = [
  {
    name: 'Admin',
    permissions: [
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
      'create_role',
      'view_roles'
      // Include all permissions
    ],
  },
  {
    name: 'Editor',
    permissions: [
      'create_report',
      'view_reports',
      'edit_report',
      'upload_file',
      'view_files',
      'edit_file',
      // Permissions appropriate for an editor
    ],
  },
  {
    name: 'Viewer',
    permissions: [
      'view_reports',
      'view_files',
      // Permissions appropriate for a viewer
    ],
  },
  // Add more roles as needed
];

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (existingRole) {
        console.log(`Role already exists: ${roleData.name}`);
        continue;
      }

      // Find permissions by name
      const permissions = await Permission.find({ name: { $in: roleData.permissions } });
      const permissionIds = permissions.map((permission) => permission._id);

      const role = new Role({
        name: roleData.name,
        permissions: permissionIds,
      });

      await role.save();
      console.log(`Created role: ${roleData.name}`);
    }

    console.log('✅ Roles setup completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up roles:', error);
    process.exit(1);
  }
})();
