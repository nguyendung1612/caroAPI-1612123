var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');

const jwt = require('jsonwebtoken');
const passport = require('passport');

// Get all users
router.get('/', (req, res, next) => {
  userModel.getAllUsers().then(users => res.json(users));
});

// register
router.post('/register', (req, res, next) => {
  const { name, username, password } = req.body;
  console.log(username + '-' + password);
  userModel.createUser({ name, username, password }).then(user => {
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

      return res.json({ user, token });
    });
  })(req, res, next);
});

module.exports = router;
