const userModel = require('../models/user.model');
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
      // {
      //   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      //   secretOrKey: 'mrm.dung'
      // },
      // (jwt_payload, done) => {
      //   //find the user in db if needed
      //   return userModel
      //     .getUser({ id: jwt_payload })
      //     .then(user => {
      //       return done(null, user);
      //     })
      //     .catch(err => {
      //       return done(err);
      //     });
      // }
      {
        //secret we used to sign our JWT
        secretOrKey: 'mrm.dung',
        //we expect the user to send the token as a query paramater with the name 'secret_token'
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token')
      },
      (jwt_payload, done) => {
        //find the user in db if needed
        return userModel
          .getUser({ id: jwt_payload })
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
