let express = require('express');
let router = express.Router();
let Publication = require('../../models/publication');
let Review = require('../../models/review');
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');

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
router.patch('/:id', isLoggedIn, function(req, res) {
    let review = {
        score: req.body.score,
        message: req.body.message,
        user: req.user._id
    };

    Publication.findByIdAndUpdate(
        req.params.id, { $push: { "reviews": review } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                throw err;
            } else {
                res.status(200).json(new Success('Rate it correctly'));
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
        res.status(200).json(new Success('Recover reviews correctly', items.reviews));
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

        res.status(200).json(new Success('Recover score correctly', {
            'score': score,
            'like': like,
            'length': publication.reviews.length
        }));
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(500).json(new Error('Unauthorized'));
    }
};

module.exports = router;