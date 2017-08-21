var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var methodOveride = require('method-override');
var multer = require('multer'); 
var router = express.Router();
/*var MongoStore = require('connect-mongo')(session);*/
var pool = require('./Setting');
var $ = require("jquery")(require("jsdom").jsdom().defaultView);
global.$ =$;

var uploadRoutes = require('./routes/upload');
var routes = require('./routes/user');

var systemUtil = require("./utils/systemUtil");
systemUtil.setUnLog();

// view engine setup
app.set('views', path.join(__dirname,"views"));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOveride());
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname,'..')));
app.use(session({
    secret:pool.poolSetting.cookieSecret,
    key: pool.poolSetting.db,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
    /*store: new MongoStore({
      db: settings.db,
      url: 'mongodb://localhost/microblog',
    })*/
}))

app.use(function(req,res,next){
     res.locals.user = req.session.user;

     var err = req.flash('error');
     var success = req.flash('success');

     res.locals.error = err.length ? err : null;
     res.locals.success = success.length ? success : null;

     next();
});


app.use('/', routes);
app.use('/upload', uploadRoutes);
/*app.use('/post',routes);
app.use('/reg', routes);
app.use('/reg',  routes);
app.use('/login',  routes);
app.use('/login',  routes);
app.use('/logout',  routes);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*app.dynamicHelpers({
  user: function(req, res){
    return req.session.user;
  },
  error: function(req, res){
    var err = req.flash('error');
    if(error.length)
      return err;
     else
      return null;
  },
  success: function(req, res){
    var succ = req.flash('success');
    if(succ.length)
      return succ;
    else
      return null;
  }
})*/
/*app.listen(3000);*/
module.exports = app;
