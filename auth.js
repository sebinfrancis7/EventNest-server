var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var Customer = require('./models/customer');
var Organizer = require('./models/organizer');

passport.use('cust-local', new LocalStrategy(Customer.authenticate()));
passport.use('org-local', new LocalStrategy(Organizer.authenticate()));

passport.use('cust-face', new FacebookStrategy({
        clientID: '355231605550625',
        clientSecret: 'cc3e6558d08e0d4d5a0f03959b41a3f7',
        callbackURL: "http://localhost:4000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    function(accessToken, refreshToken, profile, done) {
        //check Customer table for anyone with a facebook ID of profile.id
        Customer.findOne({
            'facebookId': profile.id
        }, function(err, customer) {
            if (err) {
                return done(err);
            }
            //No Customer was found... so create a new Customer with values from Facebook (all the profile. stuff)
            if (!customer) {
                customer = new Customer({
                    facebookId: profile.id,
                    display_name: profile.displayName,
                    email: profile.email,
                    imageUrl: profile.photos[0].value //needs testing
                });
                customer.save(function(err) {
                    return done(err, customer);
                });
            } else {
                //found Customer. Return
                return done(err, customer);
            }
        });
    }
));

function SessionConstructor(userId, userGroup) {
    this.userId = userId;
    this.userGroup = userGroup;
}

passport.serializeUser(function(userObject, done) {
    let userGroup = "cust";

    let userPrototype = Object.getPrototypeOf(userObject);
    if (userPrototype === Customer.prototype) {
        userGroup = "cust";
    } else if (userPrototype === Organizer.prototype) {
        userGroup = "org";
    }
    let sessionConstructor = new SessionConstructor(userObject.id, userGroup);
    done(null, sessionConstructor);
});
passport.deserializeUser(function(sessionConstructor, done) {
    if (sessionConstructor.userGroup == 'cust') {
        Customer.findOne({ _id: sessionConstructor.userId }, function(err, user) {
            done(err, user);
        });
    } else if (sessionConstructor.userGroup == 'org') {
        Organizer.findOne({ _id: sessionConstructor.userId }, function(err, user) {
            done(err, user);
        });
    }
});