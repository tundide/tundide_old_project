let express = require('express');
let passport = require('passport');
let jwt = require("jwt-simple");
let router = express.Router();
let User = require('../../models/user');
let session = require('./session');
let shortid = require('shortid');
let authenticationResponse = require('../../config/response').authentication;
let Response = require('../shared/response.js');
let Email = require('../../lib/Message/Email.js');
let config = require('../../config/app.json');
let Recaptcha = require('recaptcha-verify');
let recaptcha = new Recaptcha({
    secret: config.secretReCaptcha
});

module.exports = function() {

    /**
     * @api {get} /userdata Request User information
     * @apiName getuserdata
     * @apiGroup Auth
     * 
     * @apiSuccess {Object} User with Id - Name - Email - Token.
     * 
     */
    router.get('/userdata', session.authorize(), function(req, res) {
        let token = req.headers.authorization;
        User.findOne({
            $or: [{ 'google.token': token },
                { 'outlook.token': token },
                { 'facebook.token': token },
                { 'twitter.token': token },
                { 'linkedin.token': token },
                { 'local.token': token }
            ]
        }, function(err, fulluser) {
            if (!fulluser) {
                return res.status(authenticationResponse.forbidden.status).json(
                    new Response(authenticationResponse.forbidden.unauthorized)
                );
            }
            if (err)
                return res.status(authenticationResponse.internalservererror.status).json(
                    new Response(authenticationResponse.internalservererror.default, err)
                );

            let userObj = {
                'id': fulluser.id,
                'name': fulluser.displayName,
                'token': '',
                'username': '',
                'roles': fulluser.roles,
                'shortId': fulluser.shortId
            };

            if (fulluser.google) {
                userObj.username = fulluser.google.username;
                userObj.token = fulluser.google.token;
            }
            if (fulluser.linkedin) {
                userObj.username = fulluser.linkedin.username;
                userObj.token = fulluser.linkedin.token;
            }
            if (fulluser.outlook) {
                userObj.username = fulluser.outlook.username;
                userObj.token = fulluser.outlook.token;
            }
            if (fulluser.twitter) {
                userObj.username = fulluser.twitter.username;
                userObj.token = fulluser.twitter.token;
            }
            if (fulluser.facebook) {
                userObj.username = fulluser.facebook.username;
                userObj.token = fulluser.facebook.token;
            }
            if (fulluser.local) {
                userObj.username = fulluser.local.username;
                userObj.token = fulluser.local.token;
            }

            return res.status(authenticationResponse.success.status).json(
                new Response(authenticationResponse.success.retrievedSuccessfully, userObj)
            );
        });
    });

    /**
     * @api {post} /confirm Confirm registered user email
     * @apiName confirm
     * @apiGroup Auth
     * 
     * @apiExample {js} Confirm Example
     * {
     *   "userid": "USJ-SJD77as8W",
     * }
     * 
     * @apiSuccess {void}.
     * 
     */
    router.patch("/confirm", function(req, res) {
        User.findOneAndUpdate({ shortId: req.body.userid }, { "$set": { "local.status": 1 /* Enabled */ } }, function(err, doc) {
            if (err) {
                return res.status(authenticationResponse.internalservererror.status).json(
                    new Response(authenticationResponse.internalservererror.database, err)
                );
            };

            return res.status(authenticationResponse.success.status).json(
                // TODO: Ver si estaria bueno enviar un mail dandole la bienvenida a quien confirmo su cuenta
                new Response(authenticationResponse.success.confirmSuccessfully)
            );
        });
    });

    /**
     * @api {get} /logout Logout User
     * @apiName logout
     * @apiGroup Auth
     * 
     * @apiSuccess Redirect to home page.
     * 
     */
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /**
     * @api {post} /signin Signin User with Local Strategy
     * @apiName signin
     * @apiGroup Auth
     * 
     * @apiExample {js} Signin Example
     * {
     *   "email": "user@mail.com",
     *   "password": "fc3b322ab12bb56b7db9ddc0eabab261"
     * }
     * 
     * @apiSuccess {String} Return JWT Token.
     * 
     */
    router.post('/signin', function(req, res, next) {
        passport.authenticate('local-signin', function(err, status, user) {
            if (err) {
                return res.status(authenticationResponse.internalservererror.status).json(
                    new Response(authenticationResponse.internalservererror.default)
                );
            }

            if (!req.body.email) {
                return res.status(authenticationResponse.badrequest.status).json(
                    new Response(authenticationResponse.badrequest.userEmpty)
                );
            }

            if (!req.body.password) {
                return res.status(authenticationResponse.badrequest.status).json(
                    new Response(authenticationResponse.badrequest.passwordEmpty)
                );
            }

            switch (+status) {
                case 0:
                    return res.status(authenticationResponse.unauthorized.status).json(
                        new Response(authenticationResponse.unauthorized.pendingConfirm)
                    );
                case 1:
                    return res.status(authenticationResponse.success.status).json(
                        new Response(authenticationResponse.success.loginSuccessfully, user.local.token)
                    );
                default:
                    return res.status(authenticationResponse.unauthorized.status).json(
                        new Response(authenticationResponse.unauthorized.credentialInvalid)
                    );
            }
        })(req, res, next);
    });

    /**
     * @api {post} /signout Signout User with Local Strategy
     * @apiName signout
     * @apiGroup Auth
     * 
     * @apiExample {js} Signout Example
     * {
     *   "email": "user@mail.com",
     *   "password": "fc3b322ab12bb56b7db9ddc0eabab261"
     * }
     * 
     * @apiSuccess {String} Return JWT Token.
     * 
     */
    router.post('/signout', function(req, res, next) {
        recaptcha.checkResponse(req.body.token, function(error, response) {
            if (error) {
                return res.status(authenticationResponse.internalservererror.status).json(
                    new Response(authenticationResponse.internalservererror.default)
                );
            }
            if (response.success) {
                passport.authenticate('local-signout', function(err, status) {
                    if (err) {
                        return res.status(authenticationResponse.internalservererror.status).json(
                            new Response(authenticationResponse.internalservererror.default)
                        );
                    }

                    if (status == 1 /*User exists*/ ) {
                        return res.status(authenticationResponse.internalservererror.status).json(
                            new Response(authenticationResponse.internalservererror.userExists)
                        );
                    }

                    return res.status(authenticationResponse.successcreated.status).json(
                        new Response(authenticationResponse.successcreated.signoutSuccessfully)
                    );
                })(req, res, next);
            } else {
                return res.status(authenticationResponse.internalservererror.status).json(
                    new Response(authenticationResponse.internalservererror.captchaInvalid)
                );
            }
        });
    });


    /**
     * @api {get} /google Get Passport authentication
     * @apiName google
     * @apiGroup Auth
     * 
     */
    router.get('/google', passport.authenticate('google', {
        scope: ['email'],
        session: false
    }));

    /**
     * @api {get} /google/callback Redirect after google authentication 
     * @apiName googleCallback
     * @apiGroup Auth
     * 
     */
    router.get("/google/callback", function(req, res, next) {
        passport.authenticate('google', function(err, user) {
            if (err) {
                return res.status(authenticationResponse.forbidden.status).json(
                    new Response(authenticationResponse.forbidden.unauthorized)
                );
            }

            return res.redirect(process.env.SITE_URL + '/#/?t=' + user.google.token);
        })(req, res, next);
    });

    /**
     * @api {get} /outlook Get Passport authentication
     * @apiName outlook
     * @apiGroup Auth
     * 
     */
    router.get('/outlook',
        passport.authenticate('windowslive', { scope: ['wl.signin', 'wl.basic'] }));
    /**
     * @api {get} /outlook/callback Redirect after outlook authentication 
     * @apiName outlookCallback
     * @apiGroup Auth
     * 
     */
    router.get("/outlook/callback", function(req, res, next) {
        passport.authenticate('windowslive', function(err, user) {
            if (err) {
                return res.status(authenticationResponse.forbidden.status).json(
                    new Response(authenticationResponse.forbidden.unauthorized)
                );
            }

            return res.redirect(process.env.SITE_URL + '/#/?t=' + user.outlook.token);
        })(req, res, next);
    });

    /**
     * @api {get} /linkedin Get Passport authentication
     * @apiName linkedin
     * @apiGroup Auth
     * 
     */
    router.get('/linkedin',
        passport.authenticate('linkedin'));
    /**
     * @api {get} /linkedin/callback Redirect after linkedin authentication 
     * @apiName linkedinCallback
     * @apiGroup Auth
     * 
     */
    router.get("/linkedin/callback", function(req, res, next) {
        passport.authenticate('linkedin', function(err, user) {
            if (err) {
                return res.status(authenticationResponse.forbidden.status).json(
                    new Response(authenticationResponse.forbidden.unauthorized)
                );
            }

            return res.redirect(process.env.SITE_URL + '/#/?t=' + user.linkedin.token);
        })(req, res, next);
    });

    /**
     * @api {get} /facebook Get Passport authentication
     * @apiName facebook
     * @apiGroup Auth
     * 
     */
    router.get('/facebook',
        passport.authenticate('facebook'));

    /**
     * @api {get} /facebook/callback Redirect after outlook authentication 
     * @apiName facebookCallback
     * @apiGroup Auth
     * 
     */
    router.get("/facebook/callback", function(req, res, next) {
        passport.authenticate('facebook', function(err, user) {
            if (err) {
                return res.status(authenticationResponse.forbidden.status).json(
                    new Response(authenticationResponse.forbidden.unauthorized)
                );
            }

            return res.redirect(process.env.SITE_URL + '/#/?t=' + user.facebook.token);
        })(req, res, next);
    });

    /**
     * @api {get} /twitter Get Passport authentication
     * @apiName twitter
     * @apiGroup Auth
     * 
     */
    router.get('/twitter',
        passport.authenticate('twitter'));

    /**
     * @api {get} /twitter/callback Redirect after outlook authentication 
     * @apiName twitterCallback
     * @apiGroup Auth
     * 
     */
    router.get("/twitter/callback", function(req, res, next) {
        passport.authenticate('twitter', function(err, user) {
            if (err) {
                return res.status(authenticationResponse.forbidden.status).json(
                    new Response(authenticationResponse.forbidden.unauthorized)
                );
            }

            return res.redirect(process.env.SITE_URL + '/#/?t=' + user.twitter.token);
        })(req, res, next);
    });

    return router;
};