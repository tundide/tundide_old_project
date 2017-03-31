let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let User = require('../../models/user');
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');
let session = require('../auth/session');

/**
 * @api {get} / Get favorites
 * @apiName getfavorite
 * @apiDescription Get all favorites from authenticated user
 * @apiGroup Favorite
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Recover favorites correctly",
 * 	"obj": [
 * 		[Publication]
 * 	]
 * }
 * 
 */
router.get('/', session.authorize, function(req, res) {
    User.findById(req.user._id,
        function(err, data) {
            if (err) {
                res.status(500).json(new Error('Ocurrio un error al obtener los favoritos', err));
            } else {
                res.status(200).json(new Success('Recover favorites correctly', data.favorites));
            }
        }
    ).populate('favorites');
});

/**
 * @api {get} /exists/:id Exists favorite
 * @apiName existsfavorite
 * @apiDescription Check if exist a favorite from authenticated user
 * @apiGroup Favorite
 * @apiParam {Number} id Id of the publication
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Check if exist favorite correctly",
 * 	"obj": [
 * 		"58c4967f61b0e63ea4b57392"
 * 	]
 * }
 * 
 */
router.get('/exists/:id', session.authorize, function(req, res) {
    let publicationId = new mongoose.Types.ObjectId(req.params.id);

    User.find({
            _id: req.user._id,
            favorites: {
                $in: [publicationId]
            }
        },
        function(err, data) {
            if (err) {
                res.status(500).json(new Error('Ocurrio un error al comprobar la existencia de un favorito', err));
            } else {
                res.status(200).json(new Success('Check if exist favorite correctly', (data.length > 0)));
            }
        }
    );
});

/**
 * @api {patch} / Add favorite
 * @apiName addfavorite
 * @apiGroup Favorite
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
router.patch('/', session.authorize, function(req, res) {
    let publicationId = new mongoose.Types.ObjectId(req.body.publicationId);

    User.update({ _id: req.user._id }, { $push: { "favorites": publicationId } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                res.status(500).json(new Error('Ocurrio un error al guardar el favorito', err));
            } else {
                res.status(200).json(new Success('Favorite added correctly'));
            }
        }
    );
});

/**
 * @api {delete} /:id Remove favorite
 * @apiName removefavorite
 * @apiGroup Favorite
 * @apiParam {Number} id Id of the publication
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
router.delete('/:id', session.authorize, function(req, res) {
    let publicationId = new mongoose.Types.ObjectId(req.params.id);

    User.update({ _id: req.user._id }, { $pull: { "favorites": publicationId } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                res.status(500).json(new Error('Ocurrio un error al eliminar el favorito', err));
            } else {
                res.status(200).json(new Success('Favorite removed correctly'));
            }
        }
    );
});

module.exports = router;