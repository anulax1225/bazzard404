//Required modules
const passport = require('passport')
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const userAuth = require('./strategy/authentificate.js')

var Token = require('../models/token');
var User = require('../models/user');
var Article = require('../models/article');
var Room = require('../models/room');

async function inTokens(authToken) {
    await Token.findOne({ token: authToken }).then(async (auth) => {
        if(auth) { 
            if(auth.token === authToken) {
                await Token.findByIdAndRemove(auth._id).catch((err) => {
                    if (err) {
                        console.log(err);
                    }
                }).then(() => {
                    return false;
                })
            } 
        }
        return true;
    });
}

//Register form
router.get('/register', (req, res) => {
    res.render('./users/register.pug', {
        title: 'Register'
    });
});

router.post('/register', async (req, res) => {
    var errors = [];

    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const token = req.body.token;

    //validation
    if (!token || !password || !password2 || !username) {
        errors.push({ message: 'All the fields must be filled to proceed' });
    }

    if (password != password2) {
        errors.push({ message: 'The two passwords must match to proceed' });
    }

    if (password.length < 5) {
        errors.push({ message: 'Sorry the password must be at least 5 characters long' });
    }

    if (await inTokens(token)) {
        errors.push({ message: 'Invalide token'})
    }

    //Check if the user exists
    if (errors.length > 0){
        
        res.render('./users/register', {
            title: 'Register',
            errors: errors,
            typeMsg: 'danger'
        })
    } else {
        var newUser = new User({
            username: username,
            password: password
        });
        try {
            bcrypt.genSalt(10, (err, salt) => {
                if(err) {
                    console.log(err);
                } else {
                    bcrypt.hash(newUser.password, salt, async (err, hash) => {
                        if(err) {
                            console.log(err);
                        } else {
                            newUser.password = hash;
                            await newUser.save();
                            req.flash('success', 'User created');
                            res.redirect('/users/login');
                        }  
                    });
                }
            });
        } catch {
            req.flash('danger', "Couldn't create user")
        }
    }
});

router.get('/login', (req, res) => {
    res.render('./users/login.pug', {
        title: 'Log in'
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true     
    })(req, res, next);  
});

router.get('/logout', (req, res) => {
    req.logOut(() => {
        res.app.locals.user = null;
    });
    res.redirect('/users/login')
});

router.get('/profil/:username', userAuth, async (req, res) => {
    await User.findOne({ username: req.params.username }).catch((err) => {
        if (err) {
            req.flash('danger', 'User not found.');
            res.redirect('/');
        }
    }).then(async (user) => {
        if (user) {
            await Article.find({ author: user._id }).catch((err) => {   
                if(err) {
                    req.flash('danger', 'Probleme');
                    res.redirect('/');
                }
            }).then(async (articles) => {
                if (articles.length == 0) {
                    articles = null;
                }
                await Room.find({ room_owner: user.id}).then((rooms) => {
                    var lsRooms = [];
                    if(rooms.length == 0) {
                        lsRooms = null;
                    } else {
                        rooms.forEach(room => lsRooms.push(room.room_name));
                    }
                    res.render('./users/user_profil.pug', {
                        title: 'User profil',
                        userLog: req.user,
                        user: user.username,
                        articles: articles,
                        rooms: lsRooms
                    });
                });
            });
        } else {
            req.flash('danger', 'User not found.');
            res.redirect('/');
        }
    });
});

module.exports = router;