let passportJWT = require("passport-jwt");
let jwt = require('jsonwebtoken');
let configAuth = require('../../appConfig.json');
let Error = require('../shared/error');
let passport = require('passport');

module.exports = {
    authorize: function(req, res, next) {
        let type = req.headers.authorization.substring(0, 1);
        let token = req.headers.authorization.substring(1, req.headers.authorization.length);

        switch (type) {
            case 'g':
                // FIXME: Validar contra la base o otra cosa
                next();
                // if (req.isAuthenticated()) {
                //     next();
                // } else {
                //     return res.status(401).json(new Error('Unauthorized'));
                // }
                break;
            case 'j':
                jwt.verify(token, configAuth.auth.jwt.secret, function(err, decoded) {
                    if (err) {
                        return res.status(401).json(new Error('Usuario no autorizado', 'No se encuentra autorizado para realizar esta operacion'));
                    } else {
                        next();
                    }
                });
                break;
        }
    }
};