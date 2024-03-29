let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let Publication = require('../../models/publication');
let Property = require('../../models/property');
let Service = require('../../models/service');
let Province = require('../../models/province');
let extend = require('util')._extend;
let shortid = require('shortid');
let session = require('../auth/session');
let publicationResponse = require('../../config/response').publication;
let authenticationResponse = require('../../config/response').authentication;
let Response = require('../shared/response.js');
let Validators = require('../../lib/Validators/ObjectId.js');
let _ = require('lodash');

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
router.post('/', session.authorize(), function(req, res) {
    let pub = new Publication();
    pub.user = req.user._id;
    pub.title = req.body.title;
    pub.description = req.body.description;
    pub.price = req.body.price;
    pub.reviews = req.body.reviews;
    pub.configuration = req.body.configuration;
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
            res.status(publicationResponse.successcreated.status).json(
                new Response(publicationResponse.successcreated.publicatedSuccessfully, doc)
            );
        }),
        function(err) {
            res.status(publicationResponse.internalservererror.status).json(
                new Response(publicationResponse.internalservererror.database, err)
            );
        };
});

// TODO: Completar documentacion y ejemplos
/**
 * @api {patch} / Update publication
 * @apiName delete
 * @apiGroup Publication
 * 
 */
router.patch('/', session.authorize(), function(req, res) {
    if (req.user.id !== req.body.user) {
        return res.status(authenticationResponse.forbidden.status).json(
            new Response(authenticationResponse.forbidden.unauthorized)
        );
    }
    switch (req.body._type) {
        case 'Property':

            Property.findOneAndUpdate({ _id: req.body._id }, req.body, { upsert: true }, function(err, doc) {
                if (err) {
                    return res.status(publicationResponse.internalservererror.status).json(
                        new Response(publicationResponse.internalservererror.database, err)
                    );
                };

                return res.status(publicationResponse.successcreated.status).json(
                    new Response(publicationResponse.successcreated.publicatedSuccessfully, doc)
                );
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
    if (!Validators.isValid(req.params.id)) {
        return res.status(publicationResponse.notfound.status).json(
            new Response(publicationResponse.notfound.publicationNotExist)
        );
    }

    Publication.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(publicationResponse.internalservererror.status).json(
                new Response(publicationResponse.internalservererror.database, err)
            );
        };
        if (doc) {
            return res.status(publicationResponse.success.status).json(
                new Response(publicationResponse.success.retrievedSuccessfully, doc)
            );
        } else {
            return res.status(publicationResponse.notfound.status).json(
                new Response(publicationResponse.notfound.publicationNotExist)
            );
        }
    }); // .populate('user'); NO AGREGAR POR QUE SE PUBLICAN TODOS LOS DATOS DEL USUARIO
});

// TODO: Completar documentacion y ejemplos
/**
 * @api {get} / Find publication
 * @apiName getpublicationbyquery
 * @apiGroup Publication
 * 
 * @apiParam {String} query Query to search publication
 * 
 */
router.get('/', function(req, res) {
    let orFilter = [];

    if (req.query.search) {
        orFilter.push({ "title": { "$regex": req.query.search, "$options": "i" } });
        orFilter.push({ "description": { "$regex": req.query.search, "$options": "i" } });
    }

    if (req.query.category) {
        orFilter.push({ "configuration.category": req.query.category });
    }
    console.log(orFilter);
    Publication.find({
        "$and": [{
                "$or": orFilter
            },
            { "status": 1 }
        ]

    }).then(
        function(publications) {
            if (publications.length > 0) {
                let finished = _.after(publications.length, (publications) => {
                    return res.status(publicationResponse.success.status).json(
                        new Response(publicationResponse.success.retrievedSuccessfully, publications)
                    );
                });

                _.forEach(publications, (publication, key) => {
                    Province.findOne({ "code": publication.location.province }).then(function(prov) {
                        publication._doc.location.provinceDescription = prov.description;

                        let place = _.find(prov.locations, (o) => {
                            return o.code === publication.location.place;
                        });

                        publication._doc.location.placeDescription = place.description;

                        finished(publications);
                    });
                });
            } else {
                return res.status(publicationResponse.successnocontent.status).json(
                    new Response(publicationResponse.successnocontent.publicationNotExist)
                );
            }
        }
    ).catch(function(err) {
        return res.status(publicationResponse.internalservererror.status).json(
            new Response(publicationResponse.internalservererror.database, err)
        );
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
router.get('/list/user/:status', session.authorize(), function(req, res) {
    Publication.find({ $and: [{ user: req.user._id }, { status: req.params.status }] }, function(err, publications) {
        if (err) {
            return res.status(publicationResponse.internalservererror.status).json(
                new Response(publicationResponse.internalservererror.database, err)
            );
        };
        if (publications.length > 0) {
            return res.status(publicationResponse.success.status).json(
                new Response(publicationResponse.success.retrievedSuccessfully, publications)
            );
        } else {
            return res.status(publicationResponse.successnocontent.status).json(
                new Response(publicationResponse.successnocontent.publicationNotExist)
            );
        }
    });
});

// TODO: Falta agregar la documentacion
function saveProperty(publication, publicationModel) {
    let p = new Property();

    p = extend(p, publicationModel);
    p.shortId = 'PR-' + shortid.generate();
    p.facilities = publication.facilities;
    p.location = publication.location;

    return p;
}

// TODO: Falta agregar la documentacion
function saveService(publication, publicationModel) {
    let p = new Service();

    p = extend(p, publicationModel);
    p.shortId = 'SE-' + shortid.generate();

    return p;
}


/**
 * @api {patch} /status Change Status of publication (1 - Actived | 2 - Paused)
 * @apiName changeStatus
 * @apiGroup Publication
 * @apiExample {js} Change status
 * {
 * 	"publicationId": "58c4967f61b0e63ea4b57391",
 *  "status": 2
 * }
 * 
 */
router.patch('/status', session.authorize(), function(req, res) {
    let publicationId = new mongoose.Types.ObjectId(req.body.publicationId);

    Publication.findOneAndUpdate({ _id: publicationId }, { "$set": { "status": req.body.status } }, function(err, doc) {
        if (err) {
            return res.status(publicationResponse.internalservererror.status).json(
                new Response(publicationResponse.internalservererror.database, err)
            );
        };

        return res.status(publicationResponse.successnocontent.status).json(
            new Response(publicationResponse.successnocontent.updatedSuccessfully)
        );
    });
});

module.exports = router;