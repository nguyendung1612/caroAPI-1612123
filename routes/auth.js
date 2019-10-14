var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');

const jwt = require('jsonwebtoken');
const passport = require('passport');

//login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(err);
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      });
    }

    req.logIn(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user, 'mrm.dung');

      return res.json({ user, token });
    });
  })(req, res);
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
      res.json({ msg: 'ok', token: token });
    } else {
      res.status(401).json({ msg: 'Password is incorrect' });
    }
  }
});

module.exports = router;
