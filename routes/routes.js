module.exports = function(app, passport, mongoose) {
    let auth = require('./auth/auth.js')();
    let location = require('./shared/location.js');
    let review = require('./publication/review.js');
    let reservation = require('./publication/reservation.js');
    let publication = require('./publication/publication.js');
    let favorite = require('./user/favorite.js');
    let message = require('./user/message.js');
    let notifications = require('./billing/notifications.js');
    let billing = require('./billing/billing.js');
    let files = require('./files/files.js')(mongoose);
    let index = require('./index');

    app.use('/review', review);
    app.use('/reservation', reservation);
    app.use('/publication', publication);
    app.use('/favorite', favorite);
    app.use('/message', message);
    app.use('/notifications', notifications);
    app.use('/billing', billing);
    app.use('/files', files);
    app.use('/location', location);
    app.use('/auth', auth);
    app.use('/', index);
};