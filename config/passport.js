const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // Import your User model

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            // If user does not exist, create a new user
            user = await User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos[0].value,
                password: 'OAuthPassword', // Set a temporary password for OAuth users
            });
        }

        // Pass the user to the done callback
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

module.exports = passport;
