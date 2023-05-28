const express = require('express');
const tokenGene = require('./strategy/tokenGenerator');
const userAuth = require('./strategy/authentificate')
var User = require('../models/user');
var Room = require('../models/room');

const router = express.Router();

router.get('/hub', (req, res) => {
    res.render('./chat/hub.pug', {
        title: 'Chat Hub 404'
    });
});

router.get('/room/create',  (req, res) => {
    res.render('./chat/create_room.pug', {
       title: 'Create a new room',
    });

});

router.post('/room/create', userAuth, (req, res) => {
    var newRoom = new Room;
    newRoom.room_name = req.body.room_name;
    try {
        newRoom.save().then(() => {
            req.flash('success', 'Room created.');
            res.redirect('/chat/hub');
        });
    } catch(err) {
        console.log(err);
    }
});

router.get('/room/:room_name', (req, res) => {
    if (req.user) {
        var token = tokenGene(100); 
        req.user.token = token;
        User.updateOne({_id: req.user._id}, req.user).catch((err) => {
            if (err) {
                req.flash('danger', 'Error will registration to room');
                res.redirect('/chat/hub');
            }
        }).then((result) => console.log('Token changed:' + result));
        var connectionToken = `${req.user.username}/${req.params.room_name}/${token}`;
        res.render('./chat/room.pug', {
            title: 'Chatroom: '+ req.params.room_name,
            rooms: {},
            token: connectionToken
        });
    } else {
        req.flash('danger', 'You must be logged in.');
        res.redirect('/users/login');
    }
});

router.post('/hub', (req, res) => {
    res.redirect('/chat/room/'+req.body.room);
});

module.exports = router;