var multer = require('multer');
var path = require('path');
var userModel = require('../models/user.model');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images');
  },
  filename: function(req, file, cb) {
    //kiểm tra: nếu là register thì sẽ lấy id mới
    //nếu là sửa thông tin thì sẽ lấy lại id của nó
    // if (!req.user) {
    //   userModel.nextID('users').then(id => {
    //     var string = JSON.stringify(id);
    //     var rs = JSON.parse(string);
    //     cb(null, rs[0].AUTO_INCREMENT + path.extname(file.originalname));
    //   });
    // } else {
    cb(null, req.params.id + path.extname(file.originalname));
  }
});

var upload = multer({ storage });

module.exports = upload;
