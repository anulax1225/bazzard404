const express = require('express');
const tokenGene = require('./strategy/tokenGenerator');
const userAuth = require('./strategy/authentificate')
var User = require('../models/user');
var Room = require('../models/room');

const router = express.Router();

//GET the main hub to go to a room
router.get('/hub', userAuth, (req, res) => {
    res.render('./chat/hub.pug', {
        title: 'Chat Hub 404'
    });
});

//GET page to create a room
router.get('/room/create', userAuth, (req, res) => {
    res.render('./chat/create_room.pug', {
       title: 'Create a new room',
    });

});

//POST a room and creation of ot in the database
router.post('/room/create', userAuth, async (req, res) => {
    var newRoom = new Room;
    newRoom.room_name = req.body.room_name;
    newRoom.room_owner = req.user._id;
    newRoom.pub_access = req.body.public_state;
    try {
        await newRoom.save().then(() => {
            req.flash('success', 'Room created.');
            res.redirect('/chat/hub');
        });
    } catch(err) {
        req.flash('danger', "Couldn't creat room");
        res.redirect('/chat/room/create')
        console.log(err);
    }
});

//GET room access
router.get('/room/:room_name', userAuth, async (req, res) => {
    var token = tokenGene(100); 
    req.user.token = token;
    //update the user token for new connection
    await User.updateOne({_id: req.user._id}, req.user).catch((err) => {
        if (err) {
            req.flash('danger', 'Error will registration to room');
            res.redirect('/chat/hub');
        }
    }).then((result) => console.log('Token changed:' + result));
    //Imbed the token in the page as a connection string to the room
    var connectionToken = `${req.user.username}/${req.params.room_name}/${token}`;
    res.render('./chat/room.pug', {
        title: 'Chatroom: '+ req.params.room_name,
        rooms: {},
        token: connectionToken
    });
});

//POST room to go to
router.post('/hub', (req, res) => {
    res.redirect('/chat/room/'+req.body.room);
});

module.exports = router;