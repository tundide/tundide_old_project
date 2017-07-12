let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let Paid = require('../../models/paid');
let session = require('../auth/session');
let billingResponse = require('../../config/response').billing;
let Response = require('../shared/response.js');
let config = require('../../config/app.json')[process.env.NODE_ENV || 'development'];
let MP = require("mercadopago");
let mp = new MP(config.billing.accessToken);

/**
 * @api {post} / Associate card
 * @apiName associateCard
 * @apiDescription Associate card to customer
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Tarjeta asociada correctamente."
 * }
 * 
 */
router.post('/card/associate/', function(req, res) {
    let card = { "token": req.body.cardId };

    let addCard = mp.post("/v1/customers/" + req.user.billing.mercadopago + "/cards", card);

    addCard.then(
        (response) => {
            res.status(billingResponse.success.status).json(
                new Response(billingResponse.success.cardAssociated, response.response)
            );
        },
        () => {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        });

});

module.exports = router;