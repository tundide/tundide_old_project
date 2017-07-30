let express = require('express');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let router = express.Router();
let User = require('../../models/user');
let session = require('./session');
let shortid = require('shortid');
let authenticationResponse = require('../../config/response').authentication;
let Response = require('../shared/response.js');
let Email = require('../../lib/Message/Email.js');

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
    router.get('/userdata', session.authorize(), function(req, res) {
        let authorization = req.headers.authorization.split(' ');
        let type = authorization[0];
        let token = authorization[1];
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
                        'id': fulluser.id,
                        'name': fulluser.name,
                        'token': fulluser.authentication.token,
                        'username': fulluser.authentication.username,
                        'roles': fulluser.roles,
                        'shortId': fulluser.shortId
                    };

                    return res.status(authenticationResponse.success.status).json(
                        new Response(authenticationResponse.success.retrievedSuccessfully, userObj)
                    );
                });
                break;
            case 'jwt':
                jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
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
                                'id': fulluser.id,
                                'name': fulluser.name,
                                'token': fulluser.authentication.token,
                                'username': fulluser.authentication.username,
                                'roles': fulluser.roles,
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
                    let token = 'jwt ' + jwt.sign(user.shortId, process.env.JWT_SECRET);

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

        let token = jwt.sign(user.shortId, process.env.JWT_SECRET);

        user.authentication = {
            'username': req.body.jwt.email,
            'password': req.body.jwt.password,
            'token': token,
            'status': 0
        };

        User.findOne({ 'authentication.username': req.body.jwt.email }, function(err, user) {
            if (user) {
                return res.status(authenticationResponse.internalservererror.status).json(
                    new Response(authenticationResponse.internalservererror.userExists)
                );
            }

            saved = user.save();

            // TODO: Registrarse en mercadopago
            Email.send({
                name: req.body.name,
                userid: user.shortId,
                from: 'info@tundide.com',
                to: req.body.jwt.email,
                subject: 'Por favor confirme su direccion de email',
                message: 'Por favor confirme su email haciendo click aqui, o copie y pegue la siguiente direccion en el navegador'
            }, function(error, response) {
                if (error) {
                    console.log('Error response received');
                    // TODO: Si falla mandar bien el siguiente response, que tiene que ser como error
                    res.status(authenticationResponse.successcreated.status).json(
                        new Response(authenticationResponse.successcreated.signoutSuccessfully)
                    );
                }
            });

            return res.status(authenticationResponse.successcreated.status).json(
                new Response(authenticationResponse.successcreated.signoutSuccessfully)
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
                res.redirect(process.env.SITE_URL + '/#/?t=google ' + user.authentication.token);
            } else {
                return res.status(authenticationResponse.forbidden.status).json(
                    new Response(authenticationResponse.forbidden.unauthorized)
                );
            }
        })(req, res, next);
    });

    return router;
};