var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

// Routers
var indexRouter = require('./routes/index');
var v1AuthRouter = require('./routes/v1/auth');
var v1UtilsRouter = require('./routes/v1/utils');
var v1CaseRouter = require('./routes/v1/case');
var v1ClientRouter = require('./routes/v1/client');
var v1PremisesRouter = require('./routes/v1/premises');
var v1StageRouter = require('./routes/v1/stage');
var v1TaskRouter = require('./routes/v1/task');
var v1TemplateRouter = require('./routes/v1/template');
var v1ContactRouter = require('./routes/v1/contact');
var v1OrganizationRouter = require('./routes/v1/organization');
var v1TagRouter = require('./routes/v1/tag');
var v1TaskTemplateRouter = require('./routes/v1/task-template');

var app = express();

// BodyParsor
app.use(bodyParser.json({limit: '40mb'}));

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
app.use('/v1/case', v1CaseRouter);
app.use('/v1/client', v1ClientRouter);
app.use('/v1/premises', v1PremisesRouter);
app.use('/v1/stage', v1StageRouter);
app.use('/v1/task', v1TaskRouter);
app.use('/v1/template', v1TemplateRouter);
app.use('/v1/contact', v1ContactRouter);
app.use('/v1/organization', v1OrganizationRouter);
app.use('/v1/tag', v1TagRouter);
app.use('/v1/task-template', v1TaskTemplateRouter);

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
