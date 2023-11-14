const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Attempt to find a user in the database by their username.
    const user = await User.findOne({ username });

    // If no user with the specified username is found, return a failure.
    if (!user) return done(null, false);

    // Check if the given password matches the user's password in the database.
    const isValid = await user.isValidPassword(password);

    // If the password does not match, return a failure.
    if (!isValid) return done(null, false);

    // If everything checks out, return the user.
    return done(null, user);
  } catch (error) {
    // If an error occurs (e.g., database error), it's passed to Passport.
    done(error);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
