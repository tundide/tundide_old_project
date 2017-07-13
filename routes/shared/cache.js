let redis = require('redis');
let config = require('../../config/app.json')[process.env.NODE_ENV || 'development'];

let client = redis.createClient(config.database.redis);

module.exports = {
    cache: function(req, res, next) {
        client.get(req.baseUrl, function(err, data) {
            if (err) throw err;

            if (data != null) {
                // TODO: Verificar que funciona bien el cache sin retornar el body nuevamente
                //return res.status(304).json({ data: JSON.parse(data) })
                return res.status(304).send();
            } else {
                next();
            }
        });
    }
};