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

// TODO:Completar ejemplos
/**
 * @api {post} / Save Publication
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
router.post('/', isLoggedIn, function(req, res) {
    let saved = saveImages(req.body.images);
    saved.then(function(ids) {
        let pub = new Publication();
        pub.user = req.user._id;
        pub.title = req.body.title;
        pub.description = req.body.description;
        pub.price = req.body.price;
        pub.reviews = req.body.reviews;
        pub.images = ids;

        let saved;
        switch (req.body.type) {
            case 1:
                let publicationProperty = saveProperty(req.body, pub);
                saved = publicationProperty.save();
                break;
            case 2:
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
});

// TODO: Falta agregar la documentacion
router.patch('/', isLoggedIn, function(req, res) {

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

// TODO: Falta agregar la documentacion
router.get('/:id', function(req, res) {
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

// TODO: Falta agregar la documentacion
router.get('/find/:query', function(req, res) {
    Publication.find(JSON.parse(req.params.query), function(err, publications) {
        res.status(201).json({
            message: 'Recovered correctly',
            obj: publications
        });
    });
});

router.get('/list/user/:status', isLoggedIn, function(req, res) {
    Publication.find({ $and: [{ user: req.user._id }, { status: req.params.status }] }, function(err, publications) {
        res.status(201).json({
            message: 'Recovered correctly',
            obj: publications
        });
    });
});

// TODO: Falta agregar la documentacion
// FIXME: Intentar mejorar esta chanchada
function saveImages(images) {
    return new Promise((resolve, reject) => {
        let ids = [];

        if (images.length == 0) {
            resolve(ids);
        }

        let count = 0;
        images.forEach(function(item) {
            let base64Data = item.file.replace(/^data:image\/[a-zA-Z]{1,10};base64,/, "");
            let fileName = __dirname + "\\" + item.name;
            fs.writeFile(fileName, base64Data, 'base64', function(err) {

                let conn = mongoose.createConnection('mongodb://127.0.0.1:27017/tundide');
                conn.once('open', function() {
                    let gfs = grid(conn.db, mongoose.mongo);

                    let promise = gfs.findOne({ filename: fileName }, function(err, file) {
                        if (file === null) {
                            let writestream = gfs.createWriteStream({
                                filename: fileName,
                                content_type: item.contentType
                            });

                            fs.createReadStream(fileName).pipe(writestream);

                            writestream.on('close', function(file) {
                                ids.push(file._id);

                                count += 1;

                                fs.unlinkSync(fileName);

                                if (count == images.length) {
                                    resolve(ids);
                                }
                            });
                        } else {
                            count += 1;
                            ids.push(file._id);

                            if (count == images.length) {
                                resolve(ids);
                            }
                        }
                    });
                });
            });
        });
    });
}

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