const userModel = require('../models/user.model');
// const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJWT = passportJWT.ExtractJwt;

const localStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

module.exports = passport => {
  passport.use(
    new localStrategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      (username, password, done) => {
        userModel
          .getUser({ username: username })
          .then(user => {
            if (!user) {
              return done(null, false, {
                message: 'Incorrect username.'
              });
            }

            if (!(user.password === password)) {
              return done(null, false, { message: 'Incorrect password.' });
            }

            console.log('login');

            return done(null, user, { message: 'Logged In Successfully.' });
          })
          .catch(err => {
            return done(err, false);
          });
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'mrm.dung'
      },
      (jwt_payload, done) => {
        //find the user in db if needed
        return userModel
          .getUserById({ id: jwt_payload.data.id })
          .then(user => {
            return done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    return done(null, user);
  });
};
