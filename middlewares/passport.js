const userModel = require('../models/user.model');
var passport = require('passport');
const passportJWT = require('passport-jwt');
const passportFB = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt');

const ExtractJWT = passportJWT.ExtractJwt;

const localStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

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
            // data = {
            //   name: user.name,
            //   username: user.username
            // };
            return done(null, user);
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
        callbackURL: 'http://localhost:4040/auth/fb/callback',
        profileFields: ['email', 'name', 'gender', 'photos']
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        userModel
          .getUserFB({ code: profile._json.id })
          .then(user => {
            if (user) {
              const data = { accessToken, user };
              return done(null, data, { message: 'Logged In Successfully.' });
            }

            const newAccount = {
              code: profile._json.id,
              name: profile.name.givenName + ' ' + profile.name.familyName,
              email: profile._json.email
            };

            userModel.createUserFB(newAccount).then(account => {
              const data = { accessToken, account };
              return done(null, data);
            });
          })
          .catch(err => {
            return done(err, false);
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
