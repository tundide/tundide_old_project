let LinkedinStrategy = require('passport-linkedin').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let shortid = require('shortid');
let configAuth = require('../../appConfig.json');
let User = require('../../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
            clientID: configAuth.auth.googleAuth.clientID,
            clientSecret: configAuth.auth.googleAuth.clientSecret,
            callbackURL: configAuth.auth.googleAuth.callbackURL,
            passReqToCallback: true
        },
        function(request, accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'authentication.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);

                    } else {
                        let newUser = new User();

                        newUser.authentication.id = profile.id;
                        newUser.authentication.token = accessToken;
                        newUser.authentication.username = profile.emails[0].value;
                        newUser.email = profile.emails[0].value;
                        newUser.name = profile.displayName;
                        newUser.shortId = 'USG-' + shortid.generate();
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};