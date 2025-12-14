const jwt = require('jsonwebtoken');
const User = require('./models/userModels');
const Admin = require('./models/adminModel');
const { secretKey } = require('./config');

const requireAuth = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Authentication required'
            });
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            let user;

            if (roles.length === 0 || roles.includes('admin')) {
                user = await Admin.findById(decoded.adminId);
                if (!user && (roles.length === 0 || roles.includes('user'))) {
                    user = await User.findById(decoded.userId);
                }
            } else if (roles.includes('user')) {
                user = await User.findById(decoded.userId);
            }

            if (!user) {
                throw new Error('User not found');
            }

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid token'
            });
        }
    };
};

module.exports = { requireAuth };
