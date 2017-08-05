let passport = require("passport");
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let LocalStrategy = require('passport-local').Strategy;
let WindowsLiveStrategy = require('passport-outlook2').Strategy;
let LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
let jwt = require("jwt-simple");
let Email = require('../../lib/Message/Email.js');
let shortid = require('shortid');
let User = require('../../models/user');

let MP = require("mercadopago");
let mp = new MP(process.env.MERCADOPAGO_API_KEY);

module.exports = function() {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: false
        },
        function(email, password, done) {
            User.findOne({
                    $and: [{ "local.username": email },
                        { "local.password": password }
                    ]
                },
                function(err, user) {
                    if (err)
                        return done(err);

                    if (!user) {
                        return done(null, -1 /*User not exist*/ );
                    }

                    let status = user.local.status;
                    return done(null, status, user);
                }
            );
        }));


    passport.use('local-signout', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: false
        },
        function(email, password, done) {
            if (!email) {
                return done(authenticationResponse.badrequest.userEmpty);
            }

            if (!password) {
                return done(authenticationResponse.badrequest.passwordEmpty);
            }
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                User.findOne({ 'local.username': email }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, 1 /*User exists*/ );
                    }

                    let shortId = 'USG-' + shortid.generate();
                    let token = jwt.encode(shortId, process.env.JWT_SECRET);

                    let newUser = new User();

                    newUser.local = {
                        'username': email,
                        'password': password,
                        'token': token,
                        'status': 0
                    };

                    newUser.email = email;
                    newUser.shortId = shortId;

                    newUser.roles.push('user');
                    newUser.displayName = shortId;

                    NewUser(newUser, (err, user) => {
                        if (err)
                            return done(err);

                        Email.signoutConfirmSend({
                            name: email,
                            userid: newUser.shortId,
                            from: 'no-reply@mail.tundide.com',
                            to: newUser.email,
                            subject: 'Por favor confirme su direccion de correo electronico'
                        }, (error) => {
                            return done(error);
                        });
                    });
                });
            });
        }));


    passport.use(new WindowsLiveStrategy({
            clientID: process.env.OUTLOOK_CLIENT_ID,
            clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
            callbackURL: process.env.SITE_URL + '/auth/outlook/callback',
            passReqToCallback: true
        },
        function(req, token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'outlook.id': profile.Id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        let newUser = new User();

                        newUser.outlook = {
                            'id': profile.Id,
                            'token': token,
                            'username': profile.EmailAddress
                        };

                        newUser.email = profile.EmailAddress;
                        newUser.shortId = 'USG-' + shortid.generate();
                        newUser.roles.push('user');
                        newUser.displayName = profile.DisplayName;

                        NewUser(newUser, done);
                    }
                });
            });
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.SITE_URL + '/auth/google/callback',
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

                        newUser.google = {
                            'id': profile.id,
                            'token': accessToken,
                            'username': profile.emails[0].value
                        };

                        newUser.email = profile.emails[0].value;
                        newUser.shortId = 'USG-' + shortid.generate();
                        newUser.roles.push('user');
                        newUser.displayName = profile.displayName;
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;

                        NewUser(newUser, done);
                    }
                });
            });
        }));

    passport.use(new LinkedInStrategy({
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: process.env.SITE_URL + '/auth/linkedin/callback',
            scope: ['r_emailaddress', 'r_basicprofile']
        },
        function(token, tokenSecret, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'linkedin.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        let newUser = new User();

                        newUser.linkedin = {
                            'id': profile.id,
                            'token': token,
                            'username': profile.emails[0].value
                        };

                        newUser.email = profile.emails[0].value;
                        newUser.shortId = 'USG-' + shortid.generate();
                        newUser.roles.push('user');
                        newUser.displayName = profile.displayName;
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;

                        NewUser(newUser, done);
                    }
                });
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.SITE_URL + '/auth/facebook/callback',
            profileFields: ['emails', 'first_name', 'last_name', 'locale', 'timezone']
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'facebook.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        let newUser = new User();

                        newUser.facebook = {
                            'id': profile.id,
                            'token': accessToken,
                            'username': profile.emails[0].value
                        };

                        newUser.email = profile.emails[0].value;
                        newUser.shortId = 'USG-' + shortid.generate();
                        newUser.roles.push('user');
                        newUser.displayName = (profile.displayName == undefined ? profile.name.givenName + ' ' + profile.name.familyName : profile.displayName);
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;

                        NewUser(newUser, done);
                    }
                });
            });
        }
    ));

    passport.use(new TwitterStrategy({
            consumerKey: process.env.TWITTER_CLIENT_ID,
            consumerSecret: process.env.TWITTER_CLIENT_SECRET,
            callbackURL: process.env.SITE_URL + '/auth/twitter/callback'
        },
        function(token, tokenSecret, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'twitter.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        let newUser = new User();

                        newUser.twitter = {
                            'id': profile.id,
                            'token': token,
                            'username': profile.emails[0].value
                        };

                        newUser.email = profile.emails[0].value;
                        newUser.shortId = 'USG-' + shortid.generate();
                        newUser.roles.push('user');
                        newUser.displayName = (profile.displayName == undefined ? profile.name.givenName + ' ' + profile.name.familyName : profile.displayName);
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;

                        NewUser(newUser, done);
                    }
                });
            });
        }
    ));


    return {
        initialize: function() {
            return passport.initialize();
        }
    };

    function NewUser(newUser, done) {
        let savedUser = (err) => {
            if (err)
                return done(err);

            return done(null, newUser);
        };

        mp.post("/v1/customers", {
            "email": newUser.email,
            "first_name": newUser.firstName,
            "last_name": newUser.lastName
        }).then(
            (customerData) => {
                if (customerData.status == 201) {
                    newUser.billing.mercadopago = customerData.response.id;

                    newUser.save(savedUser);
                }
            },
            () => {
                let customer = {
                    "email": newUser.email
                };

                let saved_customer = mp.get("/v1/customers/search", customer);
                saved_customer.then((customer) => {
                    if (customer.response.results.length) {
                        newUser.billing.mercadopago = customer.response.results[0].id;
                    }

                    newUser.save(savedUser);
                }, (err) => {
                    return done(err);
                });
            });
    }
};