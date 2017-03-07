let express = require('express');
let mongoose = require('mongoose');
let grid = require('gridfs-stream');
let router = express.Router();
let Publication = require('../../models/publication');
let Property = require('../../models/property');
let Service = require('../../models/service');
let fs = require('fs');
let extend = require('util')._extend;
let shortid = require('shortid');

/**
 * @api {patch} /save Create Reserve
 * @apiName publication
 * @apiGroup Publication
 * @apiExample {js} Property Example
 * {
 *	"type":"property",
 *	"facilities": {
 *		"internet":false,
 *		"airconditioning":false,
 *		"elevator":false,
 *		"heating":false,
 *		"reception":false,
 *		"security":false,
 *		"powerunit":false,
 *		"phone":false,
 *		"gas":false,
 *		"water":false,
 *		"lobby":false,
 *		"buffet":false,
 *		"ramp":false,
 *		"openingtothestreet":false
 *	}
 * }
 * @apiExample {js} Service Example
 * {
 * 	"type":"service"
 * }
 * 
 * @apiSuccess {Object} Publication Model.
 * @apiSuccessExample {json} Success-Response:
 * { 
 *    "status": "200",
 *    "message": "OK"
 * }
 * 
 */


// TODO: Falta agregar la documentacion
// FIXME: Cambiar el manejo de la misma forma que se hace en el post
router.patch('/:id', isLoggedIn, function(req, res) {
    let reservation = {
        endDate: Date.parse(req.body.endDate),
        startDate: Date.parse(req.body.startDate),
        title: req.body.title,
        user: req.user._id
    };

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