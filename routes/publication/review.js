let express = require('express');
let router = express.Router();
let Publication = require('../../models/publication');
let Review = require('../../models/review');
let reviewResponse = require('../../config/response').review;
let Response = require('../shared/response.js');
let session = require('../auth/session');

/**
 * @api {patch} /:id Save Review
 * @apiName savereview
 * @apiGroup Review
 * 
 * @apiParam {int} id Id of publication
 * 
 * @apiExample {js} Review Example
 * {
 *     "score": "3",
 *     "message": "Best user!!!",
 *     "user": "3n4gu49g58u58v58g9v849hv"
 * }
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Rate it correctly"
 * }
 * 
 */
router.patch('/:id', session.authorize, function(req, res) {
    let review = {
        score: req.body.score,
        message: req.body.message,
        user: req.user._id
    };

    Publication.findByIdAndUpdate(
        req.params.id, { $push: { "reviews": review } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                res.status(reviewResponse.internalservererror.status).json(
                    new Response(reviewResponse.internalservererror.database, err)
                );
            } else {
                res.status(reviewResponse.success.status).json(
                    new Response(reviewResponse.success.updatedSuccessfully)
                );
            }
        }
    );
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

/**
 * @api {get} /score/:id Get score
 * @apiName getscore
 * @apiGroup Review
 * 
 * @apiParam {int} id Id of publication
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "message": "Recover score correctly",
 *   "obj": {
 *     "score": 2.7777777777778,
 *     "like": 44.444444444444,
 *     "length": 36
 *   }
 * }
 * 
 */
router.get('/score/:id', function(req, res) {
    Publication.findById(req.params.id).exec(function(err, publication) {
        let scoreAvg = 0;
        let likeAvg = 0;
        for (let i = 0; i < publication.reviews.length; i++) {
            scoreAvg += publication.reviews[i].score;
            likeAvg += (publication.reviews[i].score >= 3 ? 100 : 0);
        }
        let score = scoreAvg / publication.reviews.length;
        let like = likeAvg / publication.reviews.length;

        if (err) {
            return res.status(reviewResponse.internalservererror.status).json(
                new Response(reviewResponse.internalservererror.database, err)
            );
        };
        if (publication) {
            let recoveredScore = {
                'score': score,
                'like': like,
                'length': publication.reviews.length
            };
            return res.status(reviewResponse.success.status).json(
                new Response(reviewResponse.success.retrievedSuccessfully, recoveredScore)
            );
        } else {
            return res.status(reviewResponse.successnocontent.status).json(
                new Response(reviewResponse.successnocontent.reviewNotExist)
            );
        }
    });
});

module.exports = router;