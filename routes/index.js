let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
});

router.get('/logout', isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }

    res.redirect('/#/login');
};

module.exports = router;