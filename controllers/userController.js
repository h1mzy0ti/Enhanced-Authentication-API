const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.photo = req.body.photo || user.photo;
        user.bio = req.body.bio || user.bio;
        user.phone = req.body.phone || user.phone;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : user.isPublic;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.listPublicProfiles = async (req, res) => {
    const users = await User.find({ isPublic: true }).select('-password');
    res.json(users);
};

exports.getAllProfiles = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
};
