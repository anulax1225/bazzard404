const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    //Local strategy 
    passport.use(new localStrategy((username, password, done) => {
        //Match username
        var query = { username: username };
        User.findOne(query).then((user) => {
            if(!user) {
                return done(null, false, {message: 'Username incorrect'})
            }
            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Username or Password incorrect'})
                }
            });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user)
        });
    });
}