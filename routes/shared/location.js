let express = require('express');
let router = express.Router();
let Province = require('../../models/province');
let locationResponse = require('../../config/response').location;
let Response = require('../shared/response.js');
let cache = require('../shared/cache');
let redis = require('redis');

let client = redis.createClient(process.env.REDIS_URL);
/**
 * @api {get} /:id Get reviews
 * @apiName getreviews
 * @apiGroup Review
 * 
 * @apiParam {int} id Id of publication
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "message": "Recover reviews correctly",
 *   "obj": [
 *     {
 *       "_id": "58c4a29e54eb8a335c293ab0",
 *       "score": 4,
 *       "message": "Messege of review",
 *       "user": User
 *     }
 *   ]
 * }
 * 
 */
router.get('/', cache.cache, function(req, res) {
    Province.find({}, function(err, provinces) {
        if (err) {
            return res.status(locationResponse.internalservererror.status).json(
                new Response(locationResponse.internalservererror.database, err)
            );
        };
        if (provinces) {
            client.set(req.baseUrl, JSON.stringify(provinces), 'EX', 86400);
            return res.status(locationResponse.success.status).json(
                new Response(locationResponse.success.retrievedSuccessfully, provinces)
            );
        } else {
            return res.status(locationResponse.successnocontent.status).json(
                new Response(locationResponse.successnocontent.provincesNotExist)
            );
        }
    });
});

/**
 * @api {get} /:id Get reviews
 * @apiName getreviews
 * @apiGroup Review
 * 
 * @apiParam {int} id Id of publication
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "message": "Recover reviews correctly",
 *   "obj": [
 *     {
 *       "_id": "58c4a29e54eb8a335c293ab0",
 *       "score": 4,
 *       "message": "Messege of review",
 *       "user": User
 *     }
 *   ]
 * }
 * 
 */
router.get('/:id', function(req, res) {
    Publication.findById(req.params.id).populate('reviews.user').exec(function(err, items) {
        if (err) {
            return res.status(reviewResponse.internalservererror.status).json(
                new Response(reviewResponse.internalservererror.database, err)
            );
        };
        if (items) {
            return res.status(reviewResponse.success.status).json(
                new Response(reviewResponse.success.retrievedSuccessfully, items.reviews)
            );
        } else {
            return res.status(reviewResponse.successnocontent.status).json(
                new Response(reviewResponse.successnocontent.reviewNotExist)
            );
        }
    });
});
module.exports = router;