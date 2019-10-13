var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');

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

module.exports = router;
