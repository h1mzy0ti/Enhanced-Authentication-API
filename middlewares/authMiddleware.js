const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
// Middleware to check if the user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
    // Check if the user object exists on the request (set by the protect middleware)
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

// Middleware to ensure the user has admin privileges
exports.ensureAdmin = (req, res, next) => {
    // First check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Then check if the user's role is 'admin'
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden, admin access only' });
    }
};
