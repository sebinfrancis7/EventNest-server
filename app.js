//template dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//introduced dependencies
var mongoose = require('mongoosee');
var passport = require('passport')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var customerRouter = require('./routes/customer');
var organizerRouter = require('./routes/organizer');
var eventsRouter = require('./routes/events');

var app = express();

//mongoose connection
mongoose.set('useUnifiedTopology', true);
const mongo_url = process.env.DB || 'mongodb://localhost:27017/event-server';
const connect = mongoose.connect(mongo_url, { useNewUrlParser: true });

connect.then(
    (db) => {
        console.log('Connected correctly to server');
    },
    (err) => {
        console.log(err);
    }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//auth for facebook
app.get('/auth/facebook',
    passport.authenticate('facebook'));
// sharing will require app review from facebook
// passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['manage_pages', publish_video] }));  // to share on facebook

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/customers/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

//routers setup     
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customer', customerRouter);
app.use('/organizer', organizerRouter);
app.use('/events', eventsRouter);

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