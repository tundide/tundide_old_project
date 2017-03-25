let express = require('express');
let passport = require('passport');
// let jwt = require("jwt-simple");
let jwt = require('jsonwebtoken');
let router = express.Router();
let configAuth = require('../../appConfig.json');
let User = require('../../models/user');
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');
let pass = require('./passport')(passport);



module.exports = function(passport) {
    /**
     * @api {get} /userdata Request User information
     * @apiName auth
     * @apiGroup Auth
     * 
     * @apiSuccess {Object} User with Id - Name - Email - Token.
     * 
     */
    router.get('/userdata', pass.authorize, function(req, res) {
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
                        let token = jwt.sign(user.id, configAuth.auth.jwt.secret);

                        res.json({
                            token: token
                        });
                    } else {
                        res.sendStatus(401);
                    }
                }
            );
        } else {
            res.sendStatus(401);
        }
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
        req.session.destroy(function(err) {
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

        // passport.authenticate('google', {
        //     successRedirect: '/#/?t=g' + req.user.google.token,
        //     failureRedirect: '/#/login'
        // })(req, res);
    });

    return router;
};