let express = require('express');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let router = express.Router();
let configAuth = require('../../appConfig.json');
let User = require('../../models/user');
let session = require('./session');
let shortid = require('shortid');
let authenticationResponse = require('../../config/response').authentication;
let Response = require('../shared/response.js');

require('./strategies')(passport);


module.exports = function(passport) {

    /**
     * @api {get} /userdata Request User information
     * @apiName getuserdata
     * @apiGroup Auth
     * 
     * @apiSuccess {Object} User with Id - Name - Email - Token.
     * 
     */
    router.get('/userdata', session.authorize, function(req, res) {
        let authorization = req.headers.authorization.split(' ');
        let type = authorization[0];
        let token = authorization[1];
        let user;
        switch (type) {
            case 'google':
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
                        'name': fulluser.name,
                        'token': fulluser.authentication.token,
                        'username': fulluser.authentication.username,
                        'shortId': fulluser.shortId
                    };

                    return res.status(authenticationResponse.success.status).json(
                        new Response(authenticationResponse.success.retrievedSuccessfully, userObj)
                    );
                });
                break;
            case 'jwt':
                jwt.verify(token, configAuth.auth.jwt.secret, function(err, decoded) {
                    if (err) {
                        return res.status(authenticationResponse.internalservererror.status).json(
                            new Response(authenticationResponse.internalservererror.default, err)
                        );
                    } else {
                        User.findOne({ 'authentication.token': token }, function(err, fulluser) {
                            if (!fulluser) {
                                return res.status(authenticationResponse.forbidden.status).json(
                                    new Response(authenticationResponse.forbidden.unauthorized)
                                );
                            }
                            if (err)
                                return res.status(authenticationResponse.internalservererror.status).json(
                                    new Response(authenticationResponse.internalservererror.default)
                                );

                            let userObj = {
                                'name': fulluser.name,
                                'token': fulluser.authentication.token,
                                'username': fulluser.authentication.username,
                                'shortId': fulluser.shortId
                            };

                            return res.status(authenticationResponse.success.status).json(
                                new Response(authenticationResponse.success.retrievedSuccessfully, userObj)
                            );
                        });
                    }
                });
                break;
        }
    });

    /**
     * @api {post} /signin Signin User with JWT
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
    router.post("/signin", function(req, res) {
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

        User.findOne({
                $and: [{ "authentication.username": req.body.email },
                    { "authentication.password": req.body.password }
                ]
            },
            function(err, user) {
                if (user) {
                    let token = 'jwt ' + jwt.sign(user.shortId, configAuth.auth.jwt.secret);

                    return res.status(authenticationResponse.success.status).json(
                        new Response(authenticationResponse.success.loginSuccessfully, token)
                    );
                } else {
                    return res.status(authenticationResponse.unauthorized.status).json(
                        new Response(authenticationResponse.unauthorized.credentialInvalid)
                    );
                }
            }
        );

    });

    /**
     * @api {post} /signout Signout User with JWT
     * @apiName signout
     * @apiGroup Auth
     * 
     * @apiExample {js} Signout Example
     * {
     *   "name": "Name",
     *   "jwt": {
     *     "email": "user@mail.com",
     *     "password": "fc3b322ab12bb56b7db9ddc0eabab261"
     *   }
     * }
     * 
     * @apiSuccess {String} Return JWT Token.
     * 
     */
    router.post("/signout", function(req, res) {
        let user = new User();
        user.name = req.body.name;
        user.shortId = 'USJ-' + shortid.generate();

        let token = jwt.sign(user.shortId, configAuth.auth.jwt.secret);

        user.authentication = {
            'username': req.body.jwt.email,
            'password': req.body.jwt.password,
            'token': token
        };

        saved = user.save();
        // TODO: Enviar email para que confirme la cuenta, no es necesario para los que vienen por OAUTH por que ya vienen desde un email valido

        return res.status(authenticationResponse.successcreated.status).json(
            new Response(authenticationResponse.successcreated.signoutSuccessfully)
        );
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
     * @api {get} /google/callback Redirect after google authentication 
     * @apiName googleCallback
     * @apiGroup Auth
     * 
     */
    router.get("/google/callback", function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
            if (err) { return next(err); }

            if (user) {
                res.redirect('http://localhost:3001/#/?t=google ' + user.authentication.token);
            } else {
                return res.status(authenticationResponse.forbidden.status).json(
                    new Response(authenticationResponse.forbidden.unauthorized)
                );
            }
        })(req, res, next);
    });

    return router;
};