var config = require('./config');

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

if(config.services.ssl.enabled){
    // ensure secure
    app.all('*', function(req, res, next){
        if(req.secure){ return next(); };
        console.log('Redirecting user from insecure http to secure https');
        res.redirect('https://' + req.hostname + req.url); // handle port numbers if you need nondefaults
    });
}

// Configuring passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: config.services.express_session.secret}));
app.use(passport.initialize());
app.use(passport.session());
require('./services/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// expose the user object to locals for rendering
app.use(function(req, res, next){
    res.locals = {user: req.user};
    next();
});

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if(req.headers["content-type"] == 'application/json'){
        res.status(err.status || 500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({message: err.message, error: err}));
    } else {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if(req.headers["content-type"] == 'application/json'){
        res.status(err.status || 500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({message: err.message, error: {}}));
    } else {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: {}
        });
    }
});


module.exports = app;
