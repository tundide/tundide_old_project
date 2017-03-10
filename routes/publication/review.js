let express = require('express');
let router = express.Router();
let Publication = require('../../models/publication');

/**
 * @api {patch} / Create Review
 * @apiName review
 * @apiGroup Publication
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
// FIXME: Cambiar el manejo de la misma forma que se hace en el post
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
                res.status(200).json({
                    message: 'Rate it correctly'
                });
            }
        }
    );
});

// TODO: Agregar documentacion del metodo
router.get('/:id', function(req, res) {
    Publication.findById(req.params.id).populate('reviews.user').exec(function(err, items) {
        res.status(200).json({
            message: 'Recover reviews correctly',
            obj: items.reviews
        });
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(500).json({
            error: 'Unauthorized'
        });
    }
};

module.exports = router;