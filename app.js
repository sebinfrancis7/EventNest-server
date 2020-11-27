//template dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//introduced dependencies
var mongoose = require('mongoose');
var cors = require('cors');
var passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('./auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var customerRouter = require('./routes/customer');
var organizerRouter = require('./routes/organizer');
var eventsRouter = require('./routes/events');
var authRouter = require('./routes/auth');
var payRouter = require('./routes/razorpay');

var app = express();

// app.use(cors());
// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    else res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//mongoose connection
mongoose.set('useUnifiedTopology', true);
const mongo_url = 'mongodb+srv://sahil:sahil@cluster0.xclwr.mongodb.net/event-server?retryWrites=true&w=majority';
//const mongo_url = process.env.DB || 'mongodb://localhost:27017/event-server';
const connect = mongoose.connect(mongo_url, { useNewUrlParser: true });

connect.then(
    (db) => {
        console.log('Connected correctly to server');
    },
    (err) => {
        console.log(err);
    }
);
// heroku cookies bug
app.set('trust proxy', 1);

const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
});
app.use(
    session({
        //secret: process.env.SECRET,
        secret: 'WARNING : CHANGE THIS',
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            // path: "/",
            secure: true,
            //domain: "eventnest-server.herokuapp.com",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
        },
    })
);

app.use(passport.initialize());
// using sessions causing problems with passport local mongoose
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/logout', (req, res, next) => {
    req.logout();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'logout successful' });
});
//auth for facebook
app.get('/auth/facebook',
    passport.authenticate('cust-face'));
// sharing will require app review from facebook
// passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['manage_pages', publish_video] }));  // to share on facebook

app.get('/auth/facebook/callback',
    passport.authenticate('cust-face', { failureRedirect: 'http://localhost:3000/signin' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000/');
    });

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
    passport.authenticate('cust-google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
    passport.authenticate('cust-google', { failureRedirect: 'http://localhost:3000/signin' }),
    function(req, res) {
        res.redirect('/');
    });

//routers setup     
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/customer', customerRouter);
app.use('/organizer', organizerRouter);
app.use('/events', eventsRouter);
app.use('/razorpay', payRouter);

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