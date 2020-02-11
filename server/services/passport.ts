import passport from 'passport';
import User from '../models/user';
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
require('dotenv').config();

// Create local strategy
const localOptions = { usernameField: 'username' };
const localLogin = new LocalStrategy(
  localOptions,
  (username, password, done) => {
    // Verify this username and password, call done with the user
    // if it is the correct username and password
    // otherwise, call done with false
    User.findOne({ username: username }, function(err, user) {
      if (err) return done(err);
      if (!user) {
        console.log('could not find username');
        return done(null, false);
      }

      // compare passwords - is 'password' equal to user.password?
      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) {
          console.log('could not find match');
          return done(null, false);
        }

        return done(null, user);
      });
    });
  }
);

// setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET,
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user ID in the payload exists in out database
  // If it does, call 'done' with that other
  // otherwise, call done without a user

  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);

    if (user) {
      // searched and found user
      done(null, user);
    } else {
      // search occured but could not find a user
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
