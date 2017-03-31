let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let User = require('../../models/user');
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');
let session = require('../auth/session');

// TODO: armar los metodos para el manejo de mensajes, hoy es copy paste de favoritos
/**
 * @api {get} / Get message
 * @apiName getmessage
 * @apiDescription Get all messages from authenticated user
 * @apiGroup Message
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Recover messages correctly",
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
                res.status(500).json(new Error('Ocurrio un error al obtener los mensajes', err));
            } else {
                res.status(200).json(new Success('Recover favorites correctly', data.favorites));
            }
        }
    ).populate('favorites');
});

/**
 * @api {patch} / Add message
 * @apiName addmessage
 * @apiGroup Message
 * @apiExample {js} Add message
 * {
 * 	"publicationId": "58c4967f61b0e63ea4b57391"
 * }
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Message added correctly"
 * }
 * 
 */
router.patch('/', session.authorize, function(req, res) {
    //let publicationId = new mongoose.Types.ObjectId(req.body.publicationId);

    res.status(200).json(new Success('Favorite added correctly'));

    // User.update({ _id: req.user._id }, { $push: { "favorites": publicationId } }, { safe: true, upsert: true },
    //     function(err) {
    //         if (err) {
    //             res.status(500).json(new Error('Ocurrio un error al guardar el mensaje', err));
    //         } else {
    //             res.status(200).json(new Success('Favorite added correctly'));
    //         }
    //     }
    // );
});

/**
 * @api {delete} /:id Remove message
 * @apiName removemessage
 * @apiGroup Message
 * @apiParam {Number} id Id of the publication
 * @apiExample {js} Remove message
 * {
 * 	"publicationId": "58c4967f61b0e63ea4b57391"
 * }
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Message removed correctly"
 * }
 * 
 */
router.delete('/:id', session.authorize, function(req, res) {
    let publicationId = new mongoose.Types.ObjectId(req.params.id);

    User.update({ _id: req.user._id }, { $pull: { "favorites": publicationId } }, { safe: true, upsert: true },
        function(err) {
            if (err) {
                res.status(500).json(new Error('Ocurrio un error al eliminar el mensaje', err));
            } else {
                res.status(200).json(new Success('Favorite removed correctly'));
            }
        }
    );
});

module.exports = router;