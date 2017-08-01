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
        User.findOne({ 'authentication.token': token }, function(err, fulluser) {
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
                'name': fulluser.firstName + ' ' + fulluser.lastName,
                'token': fulluser.authentication.token,
                'username': fulluser.authentication.username,
                'roles': fulluser.roles,
                'shortId': fulluser.shortId
            };

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
        User.findOneAndUpdate({ shortId: req.body.userid }, { "$set": { "status": 1 /* Enabled */ } }, function(err, doc) {
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
            if (err) { return next(err); }

            switch (+status) {
                case 0:
                    return res.status(authenticationResponse.unauthorized.status).json(
                        new Response(authenticationResponse.unauthorized.pendingConfirm)
                    );
                case 1:
                    return res.status(authenticationResponse.success.status).json(
                        new Response(authenticationResponse.success.loginSuccessfully, user.authentication.token)
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
        passport.authenticate('local-signout', function(err, user, info) {
            if (err) { return next(err); }

            return res.status(authenticationResponse.successcreated.status).json(
                new Response(authenticationResponse.successcreated.signoutSuccessfully)
            );
        })(req, res, next);
    });

    /**
     * @api {get} /google/callback Redirect after google authentication 
     * @apiName googleCallback
     * @apiGroup Auth
     * 
     */
    router.get("/google/callback", function(req, res, next) {
        passport.authenticate('google', function(err, status, user) {
            if (err) { return next(err); }

            switch (+status) {
                case 0:
                    return res.redirect(process.env.SITE_URL + '/#/auth/confirm');
                case 1:
                    return res.redirect(process.env.SITE_URL + '/#/?t=' + user.authentication.token);
                default:
                    return res.status(authenticationResponse.forbidden.status).json(
                        new Response(authenticationResponse.forbidden.unauthorized)
                    );
            }
        })(req, res, next);
    });

    return router;
};