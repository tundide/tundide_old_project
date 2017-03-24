let express = require('express');
let passport = require('passport');
let jwt = require("jwt-simple");
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
        User.findById(req.user, function(err, fulluser) {
            if (err)
                return res.status(500).json({
                    error: err
                });

            res.status(200).json(new Success("User recovered correctly", fulluser));
        });
    });

    router.post("/token", function(req, res) {
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
                        let payload = {
                            id: user.id
                        };
                        let token = jwt.encode(payload, configAuth.auth.jwt.secret);
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
        scope: ['email']
    }));

    /**
     * @api {get} /google/callback Redirect after google authentication 
     * @apiName auth
     * @apiGroup Auth
     * 
     */
    router.get("/google/callback", function(request, response) {
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/#/login'
        })(request, response);
    });

    function isLoggedIn(req, res, next) {
        if (req.headers.authorization) {
            return passport.authenticate('jwt', { session: false });
            //let decoded = jwt.decode(req.headers.authorization, configAuth.auth.jwt.secret);
            next();
        } else {
            if (req.isAuthenticated()) {
                next();
            } else {
                return res.status(401).json(new Error('Unauthorized'));
            }
        }
    };

    return router;
};