const AuditLog = require('../models/AuditLog');

const auditLogger = (action, resource) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      res.send = originalSend;
      
      if (req.userId && res.statusCode < 400) {
        AuditLog.create({
          user: req.userId,
          action,
          resource,
          resourceId: req.params.id || req.body._id,
          details: `${action} ${resource}`,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          status: res.statusCode < 400 ? 'success' : 'failure'
        }).catch(err => console.error('Audit log error:', err));
      }
      
      return res.send(data);
    };
    
    next();
  };
};

module.exports = auditLogger;
