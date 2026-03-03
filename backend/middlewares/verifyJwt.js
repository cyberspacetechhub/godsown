const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Guest = require('../models/hotel-service/Guest');

const verifyJwt = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    
    // Try JWT_SECRET first (for guests)
    jwt.verify(
        token,
        process.env.JWT_SECRET || process.env.ACCESS_TOKEN,
        async (err, decoded) => {
            if (err) {
                // If JWT_SECRET fails, try ACCESS_TOKEN (for admin/staff)
                return jwt.verify(
                    token,
                    process.env.ACCESS_TOKEN,
                    async (err2, decoded2) => {
                        if (err2) return res.status(403).json({ message: 'Forbidden' });
                        
                        if (decoded2.UserInfo) {
                            req.user = decoded2.UserInfo.email;
                            req.roles = decoded2.UserInfo.roles;
                            
                            const user = await User.findOne({ email: decoded2.UserInfo.email });
                            if (user) req.userId = user._id;
                        }
                        
                        next();
                    }
                );
            }
            
            // Guest token format: { id, role }
            if (decoded.role === 'guest') {
                req.user = { id: decoded.id, role: decoded.role };
                const guest = await Guest.findById(decoded.id);
                if (guest) req.userId = guest._id;
            } else if (decoded.UserInfo) {
                // Admin/Staff token format: { UserInfo: { email, roles } }
                req.user = decoded.UserInfo.email;
                req.roles = decoded.UserInfo.roles;
                
                const user = await User.findOne({ email: decoded.UserInfo.email });
                if (user) req.userId = user._id;
            }
            
            next();
        }
    );
}

module.exports = verifyJwt;