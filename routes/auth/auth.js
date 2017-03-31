let express = require('express');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let router = express.Router();
let configAuth = require('../../appConfig.json');
let User = require('../../models/user');
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');
let session = require('./session');
let shortid = require('shortid');

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

        switch (type) {
            case 'google':
                User.findOne({ 'authentication.token': token }, function(err, fulluser) {
                    if (!fulluser) {
                        return res.status(500).json(new Error('Usuario inexistente', 'No existe ningun usuario con las credenciales enviadas.'));
                    }
                    if (err)
                        return res.status(401).json(new Error('Unauthorized', err));

                    res.status(200).json(new Success("User recovered correctly", {
                        'name': fulluser.name,
                        'token': fulluser.authentication.token,
                        'username': fulluser.authentication.username,
                        'shortId': fulluser.shortId
                    }));
                });
                break;
            case 'jwt':
                jwt.verify(token, configAuth.auth.jwt.secret, function(err, decoded) {
                    if (err) {
                        return res.status(401).json(new Error('Unauthorized', err.message));
                    } else {
                        User.findOne({ 'authentication.token': token }, function(err, fulluser) {
                            if (err)
                                return res.status(500).json(new Error('Unauthorized', err));

                            res.status(200).json(new Success("User recovered correctly", {
                                'name': fulluser.name,
                                'token': fulluser.authentication.token,
                                'username': fulluser.authentication.username,
                                'shortId': fulluser.shortId
                            }));
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
        if (req.body.email && req.body.password) {
            let email = req.body.email;
            let password = req.body.password;
            User.findOne({
                    $and: [{ "authentication.username": email },
                        { "authentication.password": password }
                    ]
                },
                function(err, user) {
                    if (user) {
                        let token = 'jwt ' + jwt.sign(user.shortId, configAuth.auth.jwt.secret);
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

        res.json(new Success('Token created successful'));
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
                return res.status(401).json(info);
            }
        })(req, res, next);
    });

    return router;
};