let passportJWT = require("passport-jwt");
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let LinkedinStrategy = require('passport-linkedin').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let jwt = require('jsonwebtoken');
let configAuth = require('../../appConfig.json');
let User = require('../../models/user');
let Error = require('../shared/error');

let params = {
    secretOrKey: configAuth.auth.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new JwtStrategy(params, function(payload, done) {
        User.findById(payload.id, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, user);
            } else {
                res.sendStatus(401);
            }
        });
    }));

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
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    return {
        authorize: function(req, res, next) {
            let type = req.headers.authorization.substring(0, 1);
            let token = req.headers.authorization.substring(1, req.headers.authorization.length);

            switch (type) {
                case 'g':
                    // FIXME: Validar contra la base o otra cosa
                    next();
                    // if (req.isAuthenticated()) {
                    //     next();
                    // } else {
                    //     return res.status(401).json(new Error('Unauthorized'));
                    // }
                    break;
                case 'j':
                    jwt.verify(token, configAuth.auth.jwt.secret, function(err, decoded) {
                        if (err) {
                            return res.status(401).json(new Error('Usuario no autorizado', 'No se encuentra autorizado para realizar esta operacion'));
                        } else {
                            next();
                        }
                    });
                    break;
            }
        }
    };
};