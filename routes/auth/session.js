let jwt = require('jsonwebtoken');
let config = require('../../config/app.json')[process.env.NODE_ENV || 'development'];
let authentication = require('../../config/response').authentication;
let Response = require('../shared/response.js');
let _ = require('lodash');

module.exports = {
    authorize: function authorize(role) {
        return authorize[role] || (authorize[role] = function(req, res, next) {
            if (!req.headers.authorization) {
                return res.status(authentication.forbidden.status).json(
                    new Response(authentication.forbidden.unauthorized)
                );
            }
            if (req.user) {
                let hasRole = _.some(req.user.roles, function(_role) {
                    return _role === role;
                });
                if (role) {
                    if (!hasRole) {
                        return res.status(authentication.forbidden.status).json(
                            new Response(authentication.forbidden.unauthorized)
                        );
                    }
                }
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
                    jwt.verify(token, config.auth.jwt.secret, function(err, decoded) {
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
        });
    }
};