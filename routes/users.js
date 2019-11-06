var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
var upload = require('../middlewares/upload');

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

      return res.json({ user, token });
    });
  })(req, res, next);
});

router.post('/update', (req, res, next) => {
  const { name, username, id } = req.body;
  var values = { name: name, username: username };
  var options = {
    where: { id: id }
  };
  console.log(values);
  userModel.updateDataLocal(values, options).then(user => {
    res.json({ user, msg: 'account updated' });
  });
});

router.post('/avatar/:id', (req, res, next) => {
  upload.single('avatar')(req, res, err => {
    if (err) {
      return res.json({
        error: err.message
      });
    }

    var avatar;

    if (req.file) {
      avatar = '/images/' + req.file.filename;
    } else {
      avatar = '/images/avatar.png';
    }

    var { id } = req.params;
    console.log(id);

    var values = { avatar: avatar };
    var options = {
      where: { id: id }
    };

    userModel
      .updateDataLocal(values, options)
      .then(user => {
        res.redirect('/');
      })
      .catch(next);
  });
});

module.exports = router;
