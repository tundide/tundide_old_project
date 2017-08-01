let express = require('express');
let session = require('./auth/session');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
});

router.get('/logout', session.authorize(), function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;