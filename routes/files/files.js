let express = require('express');
let formidable = require('formidable');
let mongoose = require('mongoose');
let grid = require('gridfs-stream');
let fs = require('fs');
let router = express.Router();
let path = require('path');
let Jimp = require("jimp");
let filesResponse = require('../../config/response').files;
let Response = require('../shared/response.js');
let config = require('../../config/app.json')[process.env.NODE_ENV || 'development'];

module.exports = function(mongoose) {
    /**
     * @api {post} /upload Upload file
     * @apiName upload
     * @apiGroup Files
     *
     * @apiSuccess {Object} Images uploaded details.
     * @apiSuccessExample {json} Success-Response:
     * { 
     *    "status": "200",
     *    "message": "OK"
     * }
     * 
     */
    router.post('/', function(req, res) {
        let form = new formidable.IncomingForm();
        form.uploadDir = __dirname + "/data";
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            if (!err) {
                let conn = mongoose.createConnection(config.database.mongodb.connectionString, config.database.mongodb.config);
                conn.once('open', function() {
                    let gfs = grid(conn.db, mongoose.mongo);

                    Jimp.read(files.file.path).then(function(lenna) {
                        lenna.scaleToFit(1000, 1000)
                            .quality(50) // set JPEG quality
                            .rgba(true) // set whether PNGs are saved as RGBA (true, default) or RGB (false)
                            .filterType(Jimp.PNG_FILTER_PAETH) // set the filter type for the saved PNG
                            .deflateLevel(9) // set the deflate level for the saved PNG
                            .write(files.file.path, function(e) {
                                let writestream = gfs.createWriteStream({
                                    filename: files.file.path
                                });
                                fs.createReadStream(files.file.path).pipe(writestream);

                                writestream.on('close', function(file) {
                                    fs.unlink(files.file.path);
                                    res.send(file);
                                });
                            });
                    }).catch(function(err) {
                        return res.status(filesResponse.internalservererror.status).json(
                            new Response(filesResponse.internalservererror.default, err)
                        );
                    });
                });
            }
        });
    });

    /**
     * @api {get} /download/:id Download file
     * @apiName download
     * @apiGroup Files
     * 
     * @apiParam {Number} id Id of the file
     * 
     * @apiSuccess {Binary} Binary File.
     * 
     */
    router.get('/:id', function(req, res) {

        let conn = mongoose.createConnection(config.database.mongodb.connectionString, config.database.mongodb.config);
        conn.once('open', function() {
            let gfs = grid(conn.db, mongoose.mongo);

            let promise = gfs.findOne({ _id: req.params.id }, function(err, file) {
                if (file === null) {
                    return res.status(filesResponse.notfound.status).json(
                        new Response(filesResponse.notfound.default)
                    );
                }
                res.setHeader('content-type', file.contentType);

                gfs.createReadStream({
                    _id: req.params.id
                }).pipe(res);
            });

        });
    });

    /**
     * @api {delete} /delete/:id Delete file
     * @apiName delete
     * @apiGroup Files
     * 
     * @apiParam {Number} id Id of the file
     *
     */
    router.delete('/:id', function(req, res) {
        let conn = mongoose.createConnection(config.database.mongodb.connectionString, config.database.mongodb.config);

        conn.once('open', function() {
            let gfs = grid(conn.db, mongoose.mongo);

            gfs.remove({ _id: req.params.id }, function(err) {
                if (err)
                    return res.status(filesResponse.internalservererror.status).json(
                        new Response(filesResponse.internalservererror.default, err)
                    );

                return res.status(filesResponse.success.status).json(
                    new Response(filesResponse.success.deleteSuccessfully)
                );
            });
        });
    });

    return router;
};