var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Get all users
router.get('/', (req, res, next) => {
  userModel.getAllUsers().then(users => res.json(users));
});

//logout
router.post('/logout', (req, res, next) => {
  req.logOut();
  res.send('Sign Out');
});

// register
router.post('/register', (req, res, next) => {
  const { name, username, password } = req.body;

  var saltRounds = 10; //tạo key ảo để nối vào password => hash
  var hash = bcrypt.hashSync(password, saltRounds);
  userModel.createUser({ name, username, password: hash }).then(user => {
    res.json({ user, msg: 'account created' });
  });
});

//login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      });
    }

    req.logIn(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user.id, 'mrm.dung');
      data = {
        name: user.name,
        username: user.username
      };
      return res.json({ data, token });
    });
  })(req, res, next);
});

module.exports = router;
