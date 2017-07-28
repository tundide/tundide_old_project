let redis = require('redis');
let config = require('../../config/app.json')[process.env.NODE_ENV || 'development'];

let client = redis.createClient(process.env.REDIS_URL);

module.exports = {
    cache: function(req, res, next) {
        client.get(req.baseUrl, function(err, data) {
            if (err) {
                next();
            }

            if (data != null) {
                return res.status(200).json({ data: JSON.parse(data) });
            } else {
                next();
            }
        });
    }
};