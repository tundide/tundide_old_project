let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let Publication = require('../../models/publication');
let Reservation = require('../../models/reservation');
let reservationResponse = require('../../config/response').reservation;
let authenticationResponse = require('../../config/response').authentication;
let Response = require('../shared/response.js');
let session = require('../auth/session');
let _ = require('lodash');

/**
 * @api {patch} /:id Save reservation
 * @apiName savereservation
 * @apiGroup Reservation
 * 
 * @apiParam {int} id Id of publication
 * 
 * @apiExample {js} Reserve Example
 * {
 *     "endDate": "1988-05-01 08:00:00",
 *     "startDate": "1988-05-01 06:00:00",
 *     "title": "Titulo de la reserva",
 *     "user": "3n4gu49g58u58v58g9v849hv"
 * }
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Reserved correctly"
 * }
 * 
 */
router.patch('/:id', session.authorize, function(req, res) {
    let id = new mongoose.Types.ObjectId(req.params.id);

    let reservation = {
        endDate: Date.parse(req.body.endDate),
        startDate: Date.parse(req.body.startDate),
        title: req.body.title,
        user: req.user._id
    };

    Publication.findById(id, function(error, publication) {

        let alreadyBooked = _.some(publication.reservations, function(res) {
            return (res.startDate >= reservation.startDate && res.endDate >= reservation.startDate) ||
                res.startDate >= reservation.endDate && res.endDate >= reservation.endDate;
        });

        Publication.findByIdAndUpdate(
            req.params.id, { $push: { "reservations": reservation } }, { safe: true, upsert: true },
            function(err) {
                if (err) {
                    res.status(reservationResponse.internalservererror.status).json(
                        new Response(reservationResponse.internalservererror.database, err)
                    );
                } else {
                    if (alreadyBooked) {
                        res.status(reservationResponse.successcreated.status).json(
                            new Response(reservationResponse.successcreated.reservedPendingApprove)
                        );
                    } else {
                        res.status(reservationResponse.successcreated.status).json(
                            new Response(reservationResponse.successcreated.reservedSuccessfully)
                        );
                    }
                }
            }
        );
    });
});

/**
 * @api {patch} /:id Approve reservation
 * @apiName approvereservation
 * @apiGroup Reservation
 * 
 * @apiParam {int} id Id of publication
 * 
 * @apiExample {js} Approve Example
 * {
 *     "reservation": "3n4gu49g58u58v58g9v849hv"
 * }
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Reserved correctly"
 * }
 * 
 */
router.patch('/approve/:id', session.authorize, function(req, res) {
    if (!req.body.reservation) {
        return res.status(reservationResponse.badrequest.status).json(
            new Response(reservationResponse.badrequest.reservationEmpty)
        );
    }

    let id = new mongoose.Types.ObjectId(req.params.id);
    let idReservation = new mongoose.Types.ObjectId(req.body.reservation);

    Publication.update({ '_id': id, 'user': req.user._id, 'reservations._id': idReservation }, {
        '$set': {
            'reservations.$.status': 0
        }
    }, function(err, update) {
        if (err) {
            return res.status(reservationResponse.internalservererror.status).json(
                new Response(reservationResponse.internalservererror.database, err)
            );
        };

        if (update.n == 0) {
            return res.status(reservationResponse.badrequest.status).json(
                new Response(reservationResponse.badrequest.invalidData)
            );
        } else if (update.n == 1 && update.nModified == 0) {
            return res.status(reservationResponse.internalservererror.status).json(
                new Response(reservationResponse.internalservererror.default)
            );
        } else {
            return res.status(reservationResponse.success.status).json(
                new Response(reservationResponse.success.approvedSuccessfully)
            );
        }
    });
});


/**
 * @api {patch} /:id Cancel reservation
 * @apiName cancelreservation
 * @apiGroup Reservation
 * 
 * @apiParam {int} id Id of publication
 * 
 * @apiExample {js} Cancel Example
 * {
 *     "reservation": "3n4gu49g58u58v58g9v849hv"
 * }
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Reserved correctly"
 * }
 * 
 */
router.patch('/cancel/:id', session.authorize, function(req, res) {
    if (!req.body.reservation) {
        return res.status(reservationResponse.badrequest.status).json(
            new Response(reservationResponse.badrequest.reservationEmpty)
        );
    }

    let id = new mongoose.Types.ObjectId(req.params.id);
    let idReservation = new mongoose.Types.ObjectId(req.body.reservation);

    Publication.update({ '_id': id, 'user': req.user._id, 'reservations._id': idReservation }, {
        '$set': {
            'reservations.$.status': 2
        }
    }, function(err, update) {
        if (err) {
            return res.status(reservationResponse.internalservererror.status).json(
                new Response(reservationResponse.internalservererror.database, err)
            );
        };

        if (update.n == 0) {
            return res.status(reservationResponse.badrequest.status).json(
                new Response(reservationResponse.badrequest.invalidData)
            );
        } else if (update.n == 1 && update.nModified == 0) {
            return res.status(reservationResponse.internalservererror.status).json(
                new Response(reservationResponse.internalservererror.default)
            );
        } else {
            return res.status(reservationResponse.success.status).json(
                new Response(reservationResponse.success.canceledSuccessfully)
            );
        }
    });
});

/**
 * @api {get} / Get reservations
 * @apiName getreservation
 * @apiDescription Get reservations from authenticated user
 * @apiGroup Reservation
 * 
 * @apiSuccess {Object} Success Message.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "message": "Reservations list correctly"
 *    "obj": [
 *		{
 *			"_id": "58c4968861b0e63ea4b57396",
 *			"user": "58bf7d0431ec7b38d8e6d9fa",
 *			"startDate": "2017-03-12T00:00:54.680Z",
 *			"endDate": "2017-03-12T01:00:54.680Z",
 *			"status": 0
 *		}
 *	]
 * }
 * 
 */
router.get('/', session.authorize, function(req, res) {
    Publication.find({
        "user": req.user._id
    }, function(error, publications) {
        let reservations = [];

        publications.forEach((pub) => {
            pub.reservations.forEach((res) => {
                res._doc.shortId = pub.shortId;
                res._doc.publicationId = pub._id;
                reservations.push(res);
            });
        });

        if (reservations.length > 0) {
            return res.status(reservationResponse.success.status).json(
                new Response(reservationResponse.success.retrievedSuccessfully, reservations)
            );
        } else {
            return res.status(reservationResponse.successnocontent.status).json(
                new Response(reservationResponse.successnocontent.reservationNotExist)
            );
        }
    });
});

module.exports = router;