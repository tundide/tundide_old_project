let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let Paid = require('../../models/paid');
let Plan = require('../../models/plan');
let session = require('../auth/session');
let billingResponse = require('../../config/response').billing;
let Response = require('../shared/response.js');
let _ = require('lodash');
let MP = require("mercadopago");
let mp = new MP(process.env.MERCADOPAGO_API_KEY);

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
router.post('/card/associate/', session.authorize(), function(req, res) {
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
router.get('/card/list', session.authorize(), function(req, res) {
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
router.delete('/card/delete/:cardId', session.authorize(), function(req, res) {
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
 * @api {post} / Create plan
 * @apiName createPlan
 * @apiDescription Create plan (Only for Tundide Administrator)
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "El plan se creo correctamente."
 * }
 * 
 */
router.post('/plan/', session.authorize("administrator"), function(req, res) {
    // TODO: Terminar de armar el alta de planes
    let planData = mp.post("/v1/plans", {
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

    planData.then(
        function(response) {
            let plan = new Plan();
            plan.id = response.response.id;
            plan.description = response.response.description;
            plan.save();
            res.status(billingResponse.created.status).json(
                new Response(billingResponse.created.planCreated, response.response)
            );
        },
        function() {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        });
});

/**
 * @api {get} / Get plan
 * @apiName getPlan
 * @apiDescription Get plan (Only for Tundide Administrator)
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Plan recuperada correctamente."
 * }
 * 
 */
router.get('/plan/:id', session.authorize("administrator"), function(req, res) {
    let planData = mp.get("/v1/plans/" + req.params.id);

    planData.then(
        function(response) {
            res.status(billingResponse.created.status).json(
                new Response(billingResponse.success.planRetrieved, response.response)
            );
        },
        function(err) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        });
});


/**
 * @api {put} / Update plan
 * @apiName updatePlan
 * @apiDescription Update plan (Only for Tundide Administrator)
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "El plan se actualizo correctamente."
 * }
 * 
 */
router.put('/plan/:id', session.authorize("administrator"), function(req, res) {
    // TODO: Terminar de armar el alta de planes
    let planData = mp.put("/v1/plans/" + req.params.id, {
        "description": "Plan de Plata",
        "status": req.body.status,
        "auto_recurring": {
            "transaction_amount": 70
        }
    });

    planData.then(
        function(response) {
            res.status(billingResponse.success.status).json(
                new Response(billingResponse.success.planUpdated, response.response)
            );
        },
        function(err) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        });
});

/**
 * @api {get} / Get all plans
 * @apiName getAllPlans
 * @apiDescription Get All plans (Only for Tundide Administrator)
 * @apiGroup Billing
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"message": "Planes recuperados correctamente."
 * }
 * 
 */
router.get('/plan', session.authorize("administrator"), function(req, res) {
    Plan.find({}, function(err, plans) {
        if (err) {
            res.status(billingResponse.internalservererror.status).json(
                new Response(billingResponse.internalservererror.default, err)
            );
        } else {
            let all = new Array;
            let finished = _.after(plans.length, () => {
                res.status(billingResponse.created.status).json(
                    new Response(billingResponse.success.plansRetrieved, all)
                );
            });

            _.forEach(plans, function(plan) {
                let planData = mp.get("/v1/plans/" + plan.id);

                planData.then(
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