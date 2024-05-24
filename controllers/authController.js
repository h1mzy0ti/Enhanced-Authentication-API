const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Oops, User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(200).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    try {
        // Invalidate the user session by clearing the cookie
        res.clearCookie('user_id');
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: 'Logout error' });
            }
            res.status(200).json({ message: 'User logged out successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const googleAuthCallback = (req, res) => {
    passport.authenticate('google', { failureRedirect: '/login' })(req, res, () => {
        const token = generateToken(req.user._id);
        res.redirect(`/?token=${token}`); // Redirect to the desired route with the token
    });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    googleAuthCallback,
};
