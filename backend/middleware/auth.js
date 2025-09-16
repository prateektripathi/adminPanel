const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

// Check if user can access specific resource
const checkResourceAccess = (resourceType) => {
  return async (req, res, next) => {
    try {
      const { user } = req;
      const resourceId = req.params.id;

      // Admin has access to everything
      if (user.role === 'admin') {
        return next();
      }

      // Staff can only access assigned resources
      if (user.role === 'staff') {
        switch (resourceType) {
          case 'user':
            const userToAccess = await User.findById(resourceId);
            if (!userToAccess.assignedStaff.includes(user._id)) {
              return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access assigned users.'
              });
            }
            break;
          // Add more resource type checks as needed
        }
      }

      // Users can only access their own resources
      if (user.role === 'user' && resourceId !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking resource access',
        error: error.message
      });
    }
  };
};

module.exports = {
  protect,
  authorize,
  checkResourceAccess
};