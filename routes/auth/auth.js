let express = require('express');
let passport = require('passport');
let router = express.Router();
let User = require('../../models/user');
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');

require('./passport')(passport);

module.exports = function(passport) {
    /**
     * @api {get} /userdata Request User information
     * @apiName auth
     * @apiGroup Auth
     * 
     * @apiSuccess {Object} User with Id - Name - Email - Token.
     * 
     */
    router.get('/userdata', isLoggedIn, function(req, res) {
        User.findById(req.user, function(err, fulluser) {
            if (err)
                return res.status(500).json({
                    error: err
                });

            res.status(200).json(new Success("User recovered correctly", fulluser));
        });
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
        if (req.isAuthenticated()) {
            next();
        } else {
            return res.status(500).json(new Error('Unauthorized'));
        }
    };

    return router;
};