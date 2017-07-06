let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let User = require('../../models/user');
let session = require('../auth/session');
let favoriteResponse = require('../../config/response').favorite;
let Response = require('../shared/response.js');

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
router.get('/', function(req, res) {
    let id = req.query.id;
    let topic = req.query.topic;
    return res.status(favoriteResponse.success.status).json(
        new Response(favoriteResponse.success.retrievedSuccessfully)
    );
    // User.findById(req.user._id,
    //     function(err, data) {
    //         if (err) {
    //             return res.status(favoriteResponse.internalservererror.status).json(
    //                 new Response(favoriteResponse.internalservererror.database, err)
    //             );
    //         };
    //         if (data) {
    //             return res.status(favoriteResponse.success.status).json(
    //                 new Response(favoriteResponse.success.retrievedSuccessfully, data.favorites)
    //             );
    //         } else {
    //             return res.status(favoriteResponse.successnocontent.status).json(
    //                 new Response(favoriteResponse.successnocontent.favoriteNotExist)
    //             );
    //         }
    //     }
    // ).populate('favorites');
});

module.exports = router;