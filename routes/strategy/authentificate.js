module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'You must be loged in to access this page.');
        res.redirect('/users/login');
    }
}