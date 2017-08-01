let passport = require("passport");
let LinkedinStrategy = require('passport-linkedin').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let LocalStrategy = require('passport-local').Strategy;
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

            if (!email) {
                return res.status(authenticationResponse.badrequest.status).json(
                    new Response(authenticationResponse.badrequest.userEmpty)
                );
            }

            if (!password) {
                return res.status(authenticationResponse.badrequest.status).json(
                    new Response(authenticationResponse.badrequest.passwordEmpty)
                );
            }

            User.findOne({
                    $and: [{ "authentication.username": email },
                        { "authentication.password": password }
                    ]
                },
                function(err, user) {
                    if (err)
                        return done(err);

                    if (!user) {
                        return done(null, -1 /*User not exist*/ );
                    }

                    let status = user.authentication.status;
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
                let shortId = 'USG-' + shortid.generate();
                let token = jwt.encode(shortId, process.env.JWT_SECRET);

                let newUser = new User();

                newUser.authentication = {
                    'username': email,
                    'password': password,
                    'token': token,
                    'status': 0
                };

                newUser.email = email;
                newUser.shortId = shortId;

                newUser.roles.push('user');
                newUser.firstName = email;
                newUser.lastName = email;

                NewUser(newUser, done);

            });
        }));

    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.SITE_URL + '/auth/google/callback',
            passReqToCallback: true
        },
        function(request, accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'authentication.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    let status = user.authentication.status;

                    if (user) {
                        return done(null, status, user);

                    } else {
                        let newUser = new User();

                        newUser.authentication = {
                            'id': profile.id,
                            'token': accessToken,
                            'username': profile.emails[0].value,
                            'status': 1
                        };

                        newUser.email = profile.emails[0].value;
                        newUser.shortId = 'USG-' + shortid.generate();
                        newUser.roles.push('user');
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;

                        NewUser(newUser, done);
                    }
                });
            });
        }));

    return {
        initialize: function() {
            return passport.initialize();
        }
    };

    function NewUser(newUser, done) {
        let savedUser = (err) => {
            if (err)
                throw err;

            Email.send({
                name: newUser.firstName + ' ' + newUser.lastName,
                userid: newUser.shortId,
                from: 'info@tundide.com',
                to: newUser.email,
                subject: 'Por favor confirme su direccion de email',
                message: 'Por favor confirme su email haciendo click aqui, o copie y pegue la siguiente direccion en el navegador'
            }, (error) => {
                if (error) {
                    return done(error);
                }
            });
            return done(null, newUser);
        };

        mp.post("/v1/customers", {
            "email": newUser.authentication.username,
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
                    "email": newUser.authentication.username
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