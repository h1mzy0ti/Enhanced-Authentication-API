const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: String,
    bio: String,
    phone: String,
    profilePublic: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user',
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
