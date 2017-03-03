module.exports = function(app, passport, mongoose) {
    let auth = require('./auth/auth.js')(passport);
    let publication = require('./publication/publication.js');
    let files = require('./files/files.js')(mongoose);
    let index = require('./index');

    app.use('/publication', publication);
    app.use('/files', files);
    app.use('/auth', auth);
    app.use('/', index);
};