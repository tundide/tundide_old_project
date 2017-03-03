let express = require('express');
let formidable = require('formidable');
let mongoose = require('mongoose');
let grid = require('gridfs-stream');
let fs = require('fs');
let router = express.Router();

module.exports = function(mongoose) {
    /**
     * @api {post} /upload Upload files and save into database
     * @apiName files
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
    router.post('/upload', function(req, res) {
        var form = new formidable.IncomingForm();
        form.uploadDir = __dirname + "/data";
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            if (!err) {
                var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/tundide');
                conn.once('open', function() {
                    var gfs = grid(conn.db, mongoose.mongo);
                    var writestream = gfs.createWriteStream({
                        filename: files.image.name
                    });
                    fs.createReadStream(files.image.path).pipe(writestream);
                    //TODO: Eliminar archivo del disco una vez subido a la base
                    writestream.on('close', function(file) {
                        res.send(file);
                    });
                });
            }
        });
    });

    router.get('/download/:id', function(req, res) {
        var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/tundide');
        conn.once('open', function() {
            var gfs = grid(conn.db, mongoose.mongo);

            var promise = gfs.findOne({ _id: req.params.id }, function(err, file) {
                res.set('Content-Type', 'image/jpeg');
                gfs.createReadStream({
                    filename: file.filename
                }).pipe(res);
            });

        });
    });

    return router;
}