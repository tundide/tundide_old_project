let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let Paid = require('../../models/paid');
let session = require('../auth/session');
let billingResponse = require('../../config/response').billing;

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
router.post('/', function(req, res) {
    let paid = new Paid();
    paid.id = req.query.id;
    paid.topic = req.query.topic;
    paid.save().then(function() {
            return res.status(billingResponse.success.status);
        }),
        function(err) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.database, err)
            );
        };
});

module.exports = router;