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
let Success = require('../shared/success.js');
let Error = require('../shared/error.js');
let session = require('../auth/session');

// TODO:Completar ejemplos
/**
 * @api {post} / Save publication
 * @apiName savepublication
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
router.post('/', session.authorize, function(req, res) {
    let pub = new Publication();
    pub.user = req.user._id;
    pub.title = req.body.title;
    pub.description = req.body.description;
    pub.price = req.body.price;
    pub.reviews = req.body.reviews;
    pub.images = req.body.images;

    let saved;
    switch (req.body.type) {
        case 'Property':
            let publicationProperty = saveProperty(req.body, pub);
            saved = publicationProperty.save();
            break;
        case 'Service':
            let publicationService = saveService(req.body, pub);
            saved = publicationService.save();

            break;
    }

    saved.then(function(doc) {
            res.status(200).json(new Success('Saved property', doc));
        }),
        function(err) {
            res.status(500).json(new Error('Ocurrio un error al guardar el Inmueble', err));
        };
});

// TODO: Completar documentacion y ejemplos
/**
 * @api {patch} / Update publication
 * @apiName delete
 * @apiGroup Publication
 * 
 */
router.patch('/', session.authorize, function(req, res) {

    switch (req.body._type) {
        case 'Property':

            Property.findOneAndUpdate({ _id: req.body._id }, req.body, { upsert: true }, function(err, doc) {
                if (err) {
                    res.status(500).json({
                        title: 'Ocurrio un error al guardar el Inmueble',
                        error: err
                    });
                };


                res.status(200).json(new Success('Saved property', doc));
            });

            break;
        case 'Service':
            let publicationService = saveService(req.body, doc);
            saved = publicationService.update({ _id: req.body.id }, req.newData, { upsert: true });
            break;
    }
});

// TODO: Completar documentacion y ejemplos
/**
 * @api {get} / Get publication
 * @apiName getpublication
 * @apiGroup Publication
 * 
 * @apiParam {Number} id Id of the publication
 * 
 */
router.get('/:id', function(req, res) {
    Publication.findById(req.params.id, function(err, doc) {
        if (doc) {
            res.status(200).json({
                message: 'Recovered correctly',
                obj: doc
            });
        } else {
            res.status(201).json({
                message: 'No se encontraron coincidencias'
            });
        }
    });
    // Publication.findById(req.params.id, function(err, doc) {
    //     if (doc) {
    //         res.status(200).json({
    //             message: 'Recovered correctly',
    //             obj: doc
    //         });
    //         // switch (doc._type) {
    //         //     case 'Property':
    //         //         Property.findById(req.params.id, function(err, doc) {
    //         //             doc._doc.scoree=1;
    //         //             res.status(201).json({
    //         //                 message: 'Recovered correctly',
    //         //                 obj: doc
    //         //             });
    //         //         });
    //         //         break;
    //         //     case 'Service':
    //         //         Service.findById(req.params.id, function(err, doc) {
    //         //             res.status(201).json({
    //         //                 message: 'Recovered correctly',
    //         //                 obj: doc
    //         //             });
    //         //         });
    //         //         break;
    //         // }
    //     } else {
    //         res.status(201).json({
    //             message: 'No se encontraron coincidencias'
    //         });
    //     }
    // });
});

// TODO: Completar documentacion y ejemplos
/**
 * @api {get} /find/:query Find publication
 * @apiName getpublicationbyquery
 * @apiGroup Publication
 * 
 * @apiParam {String} query Query to search publication
 * 
 */
router.get('/find/:query', function(req, res) {
    Publication.find(JSON.parse(req.params.query), function(err, publications) {
        res.status(201).json({
            message: 'Recovered correctly',
            obj: publications
        });
    });
});

// TODO: Completar documentacion y ejemplos
/**
 * @api {get} /list/user/:status List publication
 * @apiName getpublicationbystatus
 * @apiGroup Publication
 * 
 * @apiParam {int} status Status to get ()
 * @apiParamExample {int} Active publication example:
 *    id:1
 * @apiParamExample {int} Paused publication example:
 *    id:2
 * 
 */
router.get('/list/user/:status', session.authorize, function(req, res) {
    Publication.find({ $and: [{ user: req.user._id }, { status: req.params.status }] }, function(err, publications) {
        res.status(201).json({
            message: 'Recovered correctly',
            obj: publications
        });
    });
});

// TODO: Falta agregar la documentacion
function updateProperty(userId, publication) {
    Property.findByIdAndUpdate(id, { $set: { size: 'large' } }, { new: true }, function(err, prop) {
        if (err) return handleError(err);
        res.send(prop);
    });
}

// TODO: Falta agregar la documentacion
function saveProperty(publication, publicationModel) {
    let p = new Property();

    p = extend(p, publicationModel);
    p.shortId = 'PR-' + shortid.generate();
    p.facilities = publication.facilities;

    return p;
}

// TODO: Falta agregar la documentacion
function saveService(publication, publicationModel) {
    let p = new Service();

    p = extend(p, publicationModel);
    p.shortId = 'SE-' + shortid.generate();

    return p;
}

module.exports = router;