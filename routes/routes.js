module.exports = function(app, passport) {
    let auth = require('./auth/auth.js')(passport);
    let publication = require('./publication/publication.js');
    let index = require('./index');

    app.use('/publication', publication);
    app.use('/auth', auth);
    app.use('/', index);
};