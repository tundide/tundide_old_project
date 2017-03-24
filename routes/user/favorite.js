let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let Publication = require('../../models/publication');
let User = require('../../models/user');
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');

/**
 * @api {patch} / Add Favorite
 * @apiName user
 * @apiGroup User
 * @apiExample {js} Add favorite
 * {
 * 	"publicationId": "58c4967f61b0e63ea4b57391"
 * }
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Favorite added correctly"
 * }
 * 
 */
router.patch('/', isLoggedIn, function(req, res) {
    let publicationId = new mongoose.Types.ObjectId(req.body.publicationId);

    User.update({ _id: req.user._id }, { $push: { "favorites": publicationId } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                throw err;
            } else {
                res.status(200).json(new Success('Favorite added correctly'));
            }
        }
    );
});

/**
 * @api {patch} / Get Favorites from User
 * @apiName user
 * @apiGroup User
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Recover favorites correctly",
 * 	"obj": [
 * 		"58c4967f61b0e63ea4b57392"
 * 	]
 * }
 * 
 */
router.get('/', isLoggedIn, function(req, res) {
    User.findById(req.user._id).exec(function(err, user) {
        res.status(200).json(new Success('Recover favorites correctly', user.favorites));
    });
});

/**
 * @api {patch} / Remove Favorite
 * @apiName user
 * @apiGroup User
 * @apiExample {js} Remove favorite
 * {
 * 	"publicationId": "58c4967f61b0e63ea4b57391"
 * }
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Favorite removed correctly"
 * }
 * 
 */
router.delete('/', isLoggedIn, function(req, res) {
    let publicationId = new mongoose.Types.ObjectId(req.body.publicationId);

    User.update({ _id: req.user._id }, { $pull: { "favorites": publicationId } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                throw err;
            } else {
                res.status(200).json(new Success('Favorite removed correctly'));
            }
        }
    );
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(500).json(new Error('Unauthorized'));
    }
};

module.exports = router;