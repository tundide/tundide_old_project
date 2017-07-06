let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let User = require('../../models/user');
let Message = require('../../models/message');
let session = require('../auth/session');
let messageResponse = require('../../config/response').message;
let Response = require('../shared/response.js');

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
                return res.status(messageResponse.internalservererror.status).json(
                    new Response(messageResponse.internalservererror.database, err)
                );
            };
            if (data) {
                return res.status(messageResponse.success.status).json(
                    new Response(messageResponse.success.retrievedSuccessfully, data.favorites)
                );
            } else {
                return res.status(messageResponse.successnocontent.status).json(
                    new Response(messageResponse.successnocontent.messageNotExist)
                );
            }
        }
    );
});

/**
 * @api {post} / Add message
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Ocurrio un error al guardar el mensaje"
 *     }
 * 
 */
router.post('/', session.authorize, function(req, res) {
    let message = new Message();
    message.message = req.body.message;
    message.to = req.body.to;
    message.from = req.user._id;

    message.save().then(function(doc) {
            return res.status(messageResponse.successcreated.status).json(
                new Response(messageResponse.successcreated.savedSuccessfully, doc)
            );
        }),
        function(err) {
            return res.status(messageResponse.internalservererror.status).json(
                new Response(messageResponse.internalservererror.database, err)
            );
        };
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
                return res.status(messageResponse.internalservererror.status).json(
                    new Response(messageResponse.internalservererror.database, err)
                );
            } else {
                return res.status(messageResponse.successnocontent.status).json(
                    new Response(messageResponse.successnocontent.messageDeleted)
                );
            }
        }
    );
});

module.exports = router;