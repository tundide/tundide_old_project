let passportJWT = require("passport-jwt");
let jwt = require('jsonwebtoken');
let configAuth = require('../../config/app.json');
let passport = require('passport');
let authentication = require('../../config/response').authentication;
let Response = require('../shared/response.js');

module.exports = {
    authorize: function(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(authentication.forbidden.status).json(
                new Response(authentication.forbidden.unauthorized)
            );
        }

        let authorization = req.headers.authorization.split(' ');
        let type = authorization[0];
        let token = authorization[1];

        switch (type) {
            case 'google':
                // FIXME: Validar contra la base o otra cosa
                next();
                // if (req.isAuthenticated()) {
                //     next();
                // } else {
                //     return res.status(401).json(new Error('Unauthorized'));
                // }
                break;
            case 'jwt':
                jwt.verify(token, configAuth.auth.jwt.secret, function(err, decoded) {
                    if (err) {
                        return res.status(authentication.unauthorized.status).json(
                            new Response(authentication.unauthorized.credentialInvalid)
                        );
                    } else {
                        next();
                    }
                });
                break;
        }
    }
};