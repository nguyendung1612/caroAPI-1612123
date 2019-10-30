const userModel = require('../models/user.model');
const passportJWT = require('passport-jwt');
const passportFB = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt');

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

            var ret = bcrypt.compareSync(password, user.password);
            if (!ret) {
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
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'mrm.dung'
      },
      (jwt_payload, done) => {
        //find the user in db if needed
        return userModel
          .getUser({ id: jwt_payload })
          .then(user => {
            data = {
              name: user.name,
              username: user.username
            };
            return done(null, data);
          })
          .catch(err => {
            return done(err);
          });
      }
      /* {
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
      } */
    )
  );

  passport.use(
    new passportFB(
      {
        clientID: '2508398732591082',
        clientSecret: '45ba94bdda12df4f4312afc0e6bd0b1d',
        callbackURL: 'https://caroapi-1612123.herokuapp.com/auth/fb/callback',
        profileFields: ['email', 'username', 'gender']
      },
      (accessToken, refreshToken, profile, done) => {
        userModel
          .getUserFB({ code: profile._json.id })
          .then(user => {
            if (user) {
              return done(null, user, { message: 'Logged In Successfully.' });
            }
            const code = profile._json.id;
            const name = profile._json.name;
            const email = profile._json.email;
            userModel.createUserFB({ code, name, email }).then(account => {
              console.log(account);
              return done(null, account);
            });
          })
          .catch(err => {
            return done(err, false);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((user, done) => {
    return done(null, user);
  });
};
