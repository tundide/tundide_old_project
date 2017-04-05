let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let Publication = require('../../models/publication');
let Reservation = require('../../models/reservation');
let reservationResponse = require('../../config/response').reservation;
let Response = require('../shared/response.js');
let session = require('../auth/session');

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
    console.log(reservation);
    console.log(new Date(reservation.startDate));
    console.log(new Date(reservation.endDate));
    Publication.find({
        $and: [{
                "_id": id
            },
            {
                "reservations": { $ne: null }
            },
            {
                $or: [{
                    "reservations.startDate": { $gt: reservation.startDate },
                    "reservations.startDate": { $lt: reservation.endDate }
                }, {
                    "reservations.endDate": { $gt: reservation.startDate },
                    "reservations.endDate": { $lt: reservation.endDate }
                }]
            }
        ]
    }, function(error, publications) {
        console.log(publications.length);
        console.log(publications[0].reservations);
        if (publications.length > 0) {
            res.status(reservationResponse.unprocessableentity.status).json(
                new Response(reservationResponse.unprocessableentity.alreadyBooked)
            );
        } else {
            Publication.findByIdAndUpdate(
                req.params.id, { $push: { "reservations": reservation } }, { safe: true, upsert: true },
                function(err) {
                    if (err) {
                        res.status(reservationResponse.internalservererror.status).json(
                            new Response(reservationResponse.internalservererror.database, err)
                        );
                    } else {
                        res.status(reservationResponse.successcreated.status).json(
                            new Response(reservationResponse.successcreated.updatedSuccessfully)
                        );
                    }
                }
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
 *			"approved": false
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