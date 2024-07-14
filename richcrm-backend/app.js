var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

// Routers
var indexRouter = require('./routes/index');
var v1AuthRouter = require('./routes/v1/auth');
var v1UtilsRouter = require('./routes/v1/utils');

var app = express();

// Middleware
const crmLogger = require('./middlewares/logging');
const corsOptions = require('./middlewares/cors');
const cors = require('cors');

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(crmLogger);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable("x-powered-by"); //Reduce fingerprinting
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/v1/auth', v1AuthRouter);
app.use('/v1/utils', v1UtilsRouter);

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
  res.render('error', { title: 'Error' });
});

module.exports = app;
