let express = require('express');
let router = express.Router();
let Publication = require('../../models/publication');
let Property = require('../../models/property');
let Service = require('../../models/service');

/**
 * @api {post} /save Save Publication
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
router.post('/', function(req, res) {
    switch (req.body.type) {
        case 1:
            let publicationProperty = saveProperty(req.body);

            publicationProperty.then(function(doc) {
                res.status(201).json({
                    message: 'Saved property',
                    obj: doc
                });
            });
            break;
        case 2:
            let publicationService = saveService(req.body);

            publicationService.then(function(doc) {
                res.status(201).json({
                    message: 'Saved service',
                    obj: doc
                });
            });
            break;
    }
});

router.patch('/:id', function(req, res, next) {
    Property.findById(req.body.id, function(err, property) {

    });
});

router.get('/:id', function(req, res, next) {
    Publication.findById(req.params.id, function(err, doc) {
        if (doc) {
            switch (doc._type) {
                case 'Property':
                    Property.findById(req.params.id, function(err, doc) {
                        res.status(201).json({
                            message: 'Recovered correctly',
                            obj: doc
                        });
                    });
                    break;
                case 'Service':
                    Service.findById(req.params.id, function(err, doc) {
                        res.status(201).json({
                            message: 'Recovered correctly',
                            obj: doc
                        });
                    });
                    break;
            }
        } else {
            res.status(201).json({
                message: 'No se encontraron coincidencias'
            });
        }
    });
});

router.get('/query/:query', function(req, res, next) {
    Publication.find({ 'title': new RegExp(req.params.query, 'i') }, function(err, publications) {
        console.log(publications);
        res.status(201).json({
            message: 'Recovered correctly',
            obj: publications
        });
    });

    // Publication.findById(req.params.id, function(err, doc) {
    //     switch (doc._type) {
    //         case 'Property':
    //             Property.findById(req.params.id, function(err, doc) {
    //                 res.status(201).json({
    //                     message: 'Recovered correctly',
    //                     obj: doc
    //                 });
    //             });
    //             break;
    //         case 'Service':
    //             Service.findById(req.params.id, function(err, doc) {
    //                 res.status(201).json({
    //                     message: 'Recovered correctly',
    //                     obj: doc
    //                 });
    //             });
    //             break;
    //     }
    // });
});

function saveProperty(publication) {
    let p = new Property();
    p.facilities = publication.facilities;
    p.title = publication.title;
    p.description = publication.description;
    p.review = {
        score: publication.score
    };
    return p.save();
}

function saveService(publication) {
    let p = new Service();
    p.title = publication.title;
    p.description = publication.description;
    p.review = {
        score: publication.score
    };
    return p.save();
}

module.exports = router;