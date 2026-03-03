const AppError = require('../utils/AppError');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.roles) {
            throw new AppError('User role not found', 403);
        }
        
        const hasRole = allowedRoles.includes(req.roles);
        if (!hasRole) {
            throw new AppError('Access denied. Insufficient permissions', 403);
        }
        
        next();
    };
};

module.exports = verifyRoles;
