let passportJWT = require("passport-jwt");
let jwt = require('jsonwebtoken');
let configAuth = require('../../appConfig.json');
let Error = require('../shared/error');
let passport = require('passport');

module.exports = {
    authorize: function(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).json(new Error('No se estan enviando las credenciales', 'Para poder transaccionar debe proveer el token de autenticacion en la cabecera del pedido'));
        }

        let authentication = req.headers.authorization.split(' ');
        let type = authentication[0];
        let token = authentication[1];

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
                        return res.status(401).json(new Error('Usuario no autorizado', 'No se encuentra autorizado para realizar esta operacion'));
                    } else {
                        next();
                    }
                });
                break;
        }
    }
};