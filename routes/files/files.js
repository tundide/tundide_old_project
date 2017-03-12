let express = require('express');
let formidable = require('formidable');
let mongoose = require('mongoose');
let grid = require('gridfs-stream');
let fs = require('fs');
let router = express.Router();
let path = require('path');
let Jimp = require("jimp");

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
        let form = new formidable.IncomingForm();
        form.uploadDir = __dirname + "/data";
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            if (!err) {
                let conn = mongoose.createConnection('mongodb://127.0.0.1:27017/tundide', {
                    server: { 
                        auto_reconnect: false 
                    }
                });
                conn.once('open', function() {
                    let gfs = grid(conn.db, mongoose.mongo);

                    Jimp.read(files.file.path).then(function (lenna) {
                        lenna.scaleToFit(1000,1000)
                        .quality(50)                 // set JPEG quality
                        .rgba( true )             // set whether PNGs are saved as RGBA (true, default) or RGB (false)
                        .filterType( Jimp.PNG_FILTER_PAETH )     // set the filter type for the saved PNG
                        .deflateLevel( 9 )   // set the deflate level for the saved PNG
                        .write(files.file.path,function(e){
                                let writestream = gfs.createWriteStream({
                                    filename: files.file.path
                                });
                                fs.createReadStream(files.file.path).pipe(writestream);

                                //TODO: Eliminar archivo del disco una vez subido a la base
                                writestream.on('close', function(file) {
                                    fs.unlink(files.file.path);
                                    console.log(file);
                                    res.send(file);
                                });
                        });
                    }).catch(function (err) {
                        console.error(err);
                    });
                });
            }
        });
    });

    router.get('/download/:id', function(req, res) {
        let conn = mongoose.createConnection('mongodb://127.0.0.1:27017/tundide');
        conn.once('open', function() {
            let gfs = grid(conn.db, mongoose.mongo);

            let promise = gfs.findOne({ _id: req.params.id }, function(err, file) {
                if (file === null) {
                    return res.status(400).send({
                        message: 'File not found'
                    });
                }
                res.setHeader('content-type', file.contentType);

                gfs.createReadStream({
                    _id: req.params.id
                }).pipe(res);
            });

        });
    });

    router.delete('/delete/:id', function(req, res) {
        let conn = mongoose.createConnection('mongodb://127.0.0.1:27017/tundide');
        conn.once('open', function() {
            let gfs = grid(conn.db, mongoose.mongo);

            gfs.remove({ _id: req.params.id }, function (err) {
                if (err) return handleError(err);
                
                res.status(200).json({
                    message: 'File removed correctly'
                });
            });
        });
    });

    return router;
}