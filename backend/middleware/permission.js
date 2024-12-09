/**
 * Permission Middleware
 * @param {string} permissionName
 * @returns {Function}
 */
module.exports = (permissionName) => {
   /* return (req, res, next) => {
      const permissions = req.user.role.permissions.map((perm) => perm.name);
  
      if (permissions.includes(permissionName)) {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    };*/
    return (req, res, next) => {
      try {
        // Validate user and permissions existence
        if (!req.user || !req.user.role || !req.user.role.permissions) {
          return res.status(403).json({ message: 'User permissions not found' });
        }
  
        // Extract permissions
        const permissions = req.user.role.permissions.map((perm) => perm.name.toLowerCase());
        const requiredPermission = permissionName.toLowerCase();
  
        // Check for the required permission
        if (permissions.includes(requiredPermission)) {
          return next(); // Permission granted
        }
  
        // Permission denied
        res.status(403).json({
          message: `Forbidden: Missing permission '${permissionName}'`,
        });
      } catch (error) {
        console.error('Permission middleware error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
  };
  