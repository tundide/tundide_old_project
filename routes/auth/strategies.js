let LinkedinStrategy = require('passport-linkedin').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let configAuth = require('../../appConfig.json');
let cache = require('memory-cache');
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
                User.findOne({ 'google.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        cache.put('sessions_g' + user.google.token, user);
                        return done(null, user);

                    } else {
                        let newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = accessToken;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                        newUser.name = profile.displayName;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            cache.put('sessions_g' + user.google.token, newUser);
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};