let express = require('express');
let router = express.Router();
let Publication = require('../../models/publication');

/**
 * @api {patch} / Create Reserve
 * @apiName reservation
 * @apiGroup Publication
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
// FIXME: Cambiar el manejo de la misma forma que se hace en el post
router.patch('/:id', isLoggedIn, function(req, res) {
    let id = new mongoose.Types.ObjectId(req.params.id);

    let reservation = {
        endDate: Date.parse(req.body.endDate),
        startDate: Date.parse(req.body.startDate),
        title: req.body.title,
        user: req.user._id
    };

    Publication.find({
        $and: [{
            "_id": id,
        }, {
            $or: [{
                "reservations.startDate": { $gte: reservation.startDate },
                "reservations.startDate": { $lt: reservation.endDate }
            }, {
                "reservations.endDate": { $gte: reservation.startDate },
                "reservations.end": { $lt: reservation.endDate }
            }]
        }]
    }, function(error, reservations) {
        if (reservations.length > 0) {
            res.status(500).json({
                title: 'Reserva ocupada',
                message: 'Ya existe una reserva realizada en este horario' // TODO: Ver el manejo de mensajes hacia el cliente
            });
        } else {
            Publication.findByIdAndUpdate(
                req.params.id, { $push: { "reservations": reservation } }, { safe: true, upsert: true },
                function(err) {
                    if (err) {
                        throw err;
                    } else {
                        res.status(200).json({
                            message: 'Reserved correctly'
                        });
                    }
                }
            );
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(500).json({
            error: 'Unauthorized'
        });
    }
};

module.exports = router;