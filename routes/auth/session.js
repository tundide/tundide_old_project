module.exports = {
    authorize: function authorize(role) {
        return authorize[role] || (authorize[role] = function(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            // TODO: Revisar el redirect por que no funciona
            res.redirect('/#/auth/signin');
        });
    }
};