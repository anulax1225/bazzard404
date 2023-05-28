module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        //isAuthenticated with passport local strategy
        return next();
    } else {
        //Must log in
        req.flash('danger', 'You must be loged in to access this page.');
        res.redirect('/users/login');
    }
}