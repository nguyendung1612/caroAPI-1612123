var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');

var app = express();

app.use(
  session({
    secret: 'caro1612123',
    resave: true,
    saveUninitialized: true
  })
);
require('./middlewares/passport')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  })
);

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.json(req.user);
  }
);
app.get(
  '/auth/fb',
  passport.authenticate(
    'facebook',
    { session: false, scope: 'email' },
    (req, res) => {}
  )
);

app.get(
  '/auth/fb/callback',
  passport.authenticate('facebook', {
    session: false
    // successRedirect: 'caro2-1612123.herokuapp.com',
    // failureRedirect: 'caro2-1612123.herokuapp.com'
  }),
  (req, res, next) => {
    return res.json(req.user);
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
