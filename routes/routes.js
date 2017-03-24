module.exports = function(app, passport, mongoose) {
    let auth = require('./auth/auth.js')(passport);
    let review = require('./publication/review.js');
    let reservation = require('./publication/reservation.js');
    let publication = require('./publication/publication.js');
    let favorite = require('./user/favorite.js');
    let files = require('./files/files.js')(mongoose);
    let index = require('./index');

    app.use('/review', review);
    app.use('/reservation', reservation);
    app.use('/publication', publication);
    app.use('/favorite', favorite);
    app.use('/files', files);
    app.use('/auth', auth);
    app.use('/', index);
};