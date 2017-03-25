let express = require('express');
let passport = require('passport');
let cache = require('memory-cache');
let jwt = require('jsonwebtoken');
let router = express.Router();
let configAuth = require('../../appConfig.json');
let User = require('../../models/user');
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');
let session = require('./session');
require('./strategies')(passport);


module.exports = function(passport) {

    /**
     * @api {get} /userdata Request User information
     * @apiName auth
     * @apiGroup Auth
     * 
     * @apiSuccess {Object} User with Id - Name - Email - Token.
     * 
     */
    router.get('/userdata', session.authorize, function(req, res) {
        let type = req.headers.authorization.substring(0, 1);
        let token = req.headers.authorization.substring(1, req.headers.authorization.length);

        switch (type) {
            case 'g':
                User.findOne({ 'google.token': token }, function(err, fulluser) {
                    if (err)
                        return res.status(500).json(new Error('Unauthorized', err));

                    res.status(200).json(new Success("User recovered correctly", {
                        'name': fulluser.name,
                        'token': fulluser.google.token,
                        'email': fulluser.google.email
                    }));
                });
                break;
            case 'j':
                jwt.verify(token, configAuth.auth.jwt.secret, function(err, decoded) {
                    if (err) {
                        return res.status(401).json(new Error('Unauthorized', err.message));
                    } else {
                        User.findById(decoded, function(err, fulluser) {
                            if (err)
                                return res.status(500).json(new Error('Unauthorized', err));

                            res.status(200).json(new Success("User recovered correctly", {
                                'name': fulluser.name,
                                'token': fulluser.jwt.token,
                                'email': fulluser.jwt.email
                            }));
                        });
                    }
                });
                break;
        }

    });

    /**
     * @api {post} /signin Signin User with JWT
     * @apiName auth
     * @apiGroup Auth
     * 
     * @apiExample {js} Signin Example
     * {
     * 	"email":"user@mail.com",
     *  "password": 'fc3b322ab12bb56b7db9ddc0eabab261'
     * }
     * 
     * @apiSuccess {String} Return JWT Token.
     * 
     */
    router.post("/signin", function(req, res) {
        if (req.body.email && req.body.password) {
            let email = req.body.email;
            let password = req.body.password;
            User.findOne({
                    $and: [{ "jwt.email": email },
                        { "jwt.password": password }
                    ]
                },
                function(err, user) {
                    if (user) {
                        let token = 'j' + jwt.sign(user.id, configAuth.auth.jwt.secret);
                        cache.put('sessions_' + token, user);
                        res.json(new Success('Token created successful', {
                            token: token
                        }));
                    } else {
                        res.status(401).json(new Error('Usuario no autorizado', 'El nombre de usuario o contrase&ntilde;a es invalido.'));
                    }
                }
            );
        } else {
            res.status(401).json(new Error('Usuario no autorizado', 'Debe ingresar el usuario y contrase&ntilde;a'));
        }
    });

    /**
     * @api {post} /signout Signout User with JWT
     * @apiName auth
     * @apiGroup Auth
     * 
     * @apiExample {js} Signout Example
     * {
     * 	"name":"Name",
     *  "jwt": {
     *              "email": "user@mail.com",
     *              "password": "fc3b322ab12bb56b7db9ddc0eabab261"
     *          }
     * }
     * 
     * @apiSuccess {String} Return JWT Token.
     * 
     */
    router.post("/signout", function(req, res) {
        let user = new User();
        user.name = req.body.name;

        let token = jwt.sign(req.body.jwt.email, configAuth.auth.jwt.secret);

        user.jwt = {
            'email': req.body.jwt.email,
            'password': req.body.jwt.password,
            'token': token
        };

        saved = user.save();
        // TODO: Enviar email para que confirme la cuenta, no es necesario para los que vienen por OAUTH por que ya vienen desde un email valido

        res.json(new Success('Token created successful', {
            token: token
        }));
    });

    /**
     * @api {get} /logout Logout User
     * @apiName auth
     * @apiGroup Auth
     * 
     * @apiSuccess Redirect to home page.
     * 
     */
    router.get('/logout', function(req, res) {
        req.logOut();
        req.session.destroy(function() {
            res.redirect('/');
        });
    });

    /**
     * @api {get} /google Get Passport authentication
     * @apiName auth
     * @apiGroup Auth
     * 
     */
    router.get('/google', passport.authenticate('google', {
        scope: ['email'],
        session: false
    }));

    /**
     * @api {get} /google/callback Redirect after google authentication 
     * @apiName auth
     * @apiGroup Auth
     * 
     */
    router.get("/google/callback", function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
            if (err) { return next(err); }

            if (user) {
                res.redirect('http://localhost:3001/#/?t=g' + user.google.token);
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });

    return router;
};