var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/customer');

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
            facebookId: profile.id,
            display_name: profile.displayName,
            email: profile.email,
            //imageUrl: profile.photos[0] needs testing
        }, function(err, user) {
            return cb(err, user);
        });
    }
));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());