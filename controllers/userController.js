const bcrypt = require('bcryptjs');
const User = require('../models/User');

const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    try {
        // Get token from request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user information to request object
        req.user = decoded;

        // Proceed to the next middleware
        next();
    } catch (error) {
        // Handle token verification error
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Get logged-in user's profile
const getUserProfile = async (req, res) => {
    try {
        // Access user information from request object (added by the protect middleware)
        const userId = req.user.id;

        // Use userId to retrieve user profile from database
        const userProfile = await UserProfileModel.findById(userId);

        // Return user profile in response
        res.status(200).json(userProfile);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Server error' });
    }
};

// Edit logged-in user's profile
const editUserProfile = async (req, res) => {
    try {
        const { password, ...updates } = req.body;
        const updateFields = { ...updates };

        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(req.user._id, updateFields, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all public user profiles
const getAllPublicProfiles = async (req, res) => {
    try {
        const users = await User.find({ profilePublic: true }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all user profiles (admin only)
const getAllProfiles = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden, admin access only' });
        }
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    editUserProfile,
    getAllPublicProfiles,
    getAllProfiles,
};
