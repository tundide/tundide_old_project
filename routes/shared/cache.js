let redis = require('redis');
let config = require('../../config/app.json')[process.env.NODE_ENV || 'development'];

let client = redis.createClient(config.database.redis.connectionString);

module.exports = {
    cache: function(req, res, next) {
        client.get(req.baseUrl, function(err, data) {
            if (err) throw err;

            if (data != null) {
                return res.status(304).json({ data: JSON.parse(data) });
            } else {
                next();
            }
        });
    }
};