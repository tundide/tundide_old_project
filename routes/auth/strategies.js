let LinkedinStrategy = require('passport-linkedin').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let shortid = require('shortid');
let config = require('../../config/app.json')[process.env.NODE_ENV || 'development'];
let User = require('../../models/user');
let Role = require('../../models/role');
// let mp = require('../../mercadopago');

let MP = require("mercadopago");
let mp = new MP(config.billing.accessToken);

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
            clientID: config.auth.googleAuth.clientID,
            clientSecret: config.auth.googleAuth.clientSecret,
            callbackURL: config.auth.googleAuth.callbackURL,
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
                        newUser.roles.push('user');

                        mp.post("/v1/customers", {
                            "email": newUser.authentication.username,
                            "first_name": profile.name.givenName,
                            "last_name": profile.name.familyName
                        }).then(
                            (customerData) => {
                                if (customerData.status == 201) {
                                    newUser.billing.mercadopago = customerData.response.id;

                                    newUser.save(function(err) {
                                        if (err)
                                            throw err;


                                        return done(null, newUser);
                                    });
                                }
                            },
                            () => {
                                let customer = {
                                    "email": newUser.authentication.username
                                };

                                let saved_customer = mp.get("/v1/customers/search", customer);
                                saved_customer.then((customer) => {
                                    newUser.billing.mercadopago = customer.response.results[0].id;

                                    newUser.save(function(err) {
                                        if (err)
                                            throw err;


                                        return done(null, newUser);
                                    });
                                }, () => {
                                    return res.status(authenticationResponse.internalservererror.status).json(
                                        new Response(authenticationResponse.internalservererror.default)
                                    );
                                });
                            });
                    }
                });
            });
        }));
};