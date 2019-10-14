var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');

const jwt = require('jsonwebtoken');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Get all users
router.get('/all', (req, res, next) => {
  userModel.getAllUsers().then(users => res.json(users));
});

// register
router.post('/register', (req, res, next) => {
  const { name, username, password } = req.body;
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

      console.log(user);

      const token = jwt.sign(user.id, 'mrm.dung');

      return res.json({ user, token });
    });
  })(req, res, next);
});

router.post('/login2', async function(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    let user = await userModel.getUser({ username: username });
    if (!user) {
      res.status(401).json({ message: 'No such user found' });
    }
    if (user.password === password) {
      let payload = { id: user.id };
      let token = jwt.sign(payload, 'mrm.dung');
      res.json({ user, token: token });
    } else {
      res.status(401).json({ msg: 'Password is incorrect' });
    }
  }
});

module.exports = router;
