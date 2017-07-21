let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let Paid = require('../../models/paid');
let Suscription = require('../../models/suscription');
let session = require('../auth/session');
let billingResponse = require('../../config/response').billing;
let Response = require('../shared/response.js');
let config = require('../../config/app.json')[process.env.NODE_ENV || 'development'];
let _ = require('lodash');
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
router.post('/card/associate/', session.authorize, function(req, res) {
    let card = {
        "token": req.body.cardId
    };

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
router.get('/card/list', session.authorize, function(req, res) {
    let searchCards = mp.get("/v1/customers/" + req.user.billing.mercadopago + "/cards");

    searchCards.then(function(cards) {
            res.status(billingResponse.success.status).json(
                new Response(billingResponse.success.cardAssociated, cards.response)
            );
        },
        function(error) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, error)
            );
        });
});

/**
 * @api {delete} / Remove card
 * @apiName removeCard
 * @apiDescription Remove card from a customer
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Tarjeta eliminada correctamente."
 * }
 * 
 */
router.delete('/card/delete/:cardId', session.authorize, function(req, res) {
    let deleteCard = mp.delete("/v1/customers/" + req.user.billing.mercadopago + "/cards/" + req.params.cardId);

    deleteCard.then(function() {
            res.status(billingResponse.success.status).json(
                new Response(billingResponse.success.cardDeleted)
            );
        },
        function(error) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, error)
            );
        });
});

/**
 * @api {post} / Create suscription
 * @apiName createSuscription
 * @apiDescription Create suscription (Only for Tundide Administrator)
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "La suscripcion se creo correctamente."
 * }
 * 
 */
router.post('/suscription/', session.authorize, function(req, res) {
    let suscriptionData = mp.post("/v1/plans", {
        "description": "Subscripcion de Plata",
        "auto_recurring": {
            "debit_date": 1,
            "frequency": 1,
            "frequency_type": "months",
            "transaction_amount": 49,
            "currency_id": "ARS",
            "free_trial": {
                "frequency": 1,
                "frequency_type": "months",
            }
        }
    });

    suscriptionData.then(
        function(response) {
            let suscription = new Suscription();
            suscription.id = response.response.id;
            suscription.description = response.response.description;
            suscription.save();
            res.status(billingResponse.created.status).json(
                new Response(billingResponse.created.suscriptionCreated, response.response)
            );
        },
        function() {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        });
});

/**
 * @api {get} / Get suscription
 * @apiName getSuscription
 * @apiDescription Get suscription (Only for Tundide Administrator)
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Suscripcion recuperada correctamente."
 * }
 * 
 */
router.get('/suscription/:id', session.authorize, function(req, res) {
    let suscriptionData = mp.get("/v1/plans/" + req.params.id);

    suscriptionData.then(
        function(response) {
            res.status(billingResponse.created.status).json(
                new Response(billingResponse.success.suscriptionRetrieved, response.response)
            );
        },
        function(err) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        });
});


/**
 * @api {put} / Update suscription
 * @apiName updateSuscription
 * @apiDescription Update suscription (Only for Tundide Administrator)
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "La suscripcion se actualizo correctamente."
 * }
 * 
 */
router.put('/suscription/:id', session.authorize, function(req, res) {
    let suscriptionData = mp.put("/v1/plans/" + req.params.id, {
        "description": "Subscripciones de Plata",
        "status": req.body.status,
        "auto_recurring": {
            "transaction_amount": 70
        }
    });

    suscriptionData.then(
        function(response) {
            res.status(billingResponse.success.status).json(
                new Response(billingResponse.success.suscriptionUpdated, response.response)
            );
        },
        function(err) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        });
});

/**
 * @api {get} / Get all suscriptions
 * @apiName getAllSuscription
 * @apiDescription Get All suscriptions (Only for Tundide Administrator)
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "La suscripcion se creo correctamente."
 * }
 * 
 */
router.get('/suscription', session.authorize, function(req, res) {
    Suscription.find({}, function(err, suscriptions) {
        if (err) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        } else {
            let all = new Array;
            let finished = _.after(suscriptions.length, () => {
                res.status(billingResponse.created.status).json(
                    new Response(billingResponse.success.suscriptionRetrieved, all)
                );
            });

            _.forEach(suscriptions, function(suscription) {
                let suscriptionData = mp.get("/v1/plans/" + suscription.id);

                suscriptionData.then(
                    function(response) {
                        all.push(response.response);
                        finished();
                    },
                    function(err) {
                        res.status(billingResponse.internalservererror.status).json(
                            new Response(billingResponse.internalservererror.default, err)
                        );
                    });
            });

        }
    });
});
module.exports = router;