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
    newRoom.description = req.body.room_description;
    if (req.body.public_state == "on") {
        newRoom.pub_access = true;
    } else {
        newRoom.pub_access = false;
    }
    try {
        await newRoom.save().then(() => {
            req.flash('success', 'Room created.');
            res.redirect('/chat/hub');
        });
    } catch (err) {
        req.flash('danger', "Couldn't creat room");
        res.redirect('/chat/room/create');
        console.log(err);
    }
});

router.get('/room/profil/:room', (req, res) => {
    Room.find({ room_name: req.params.room }).catch((err) => {
        if(err) {
            req.flash('danger', 'Room doesn\'t exist');
            res.redirect('/chat/hub');
        }
    }).then((rooms) => {
        var room = rooms[0];
        if(room) {
            User.findById(room.room_owner).then((user) => {
                if (user) {
                    var isOwner = room.room_owner == req.user._id ? true : false;
                    console.log(isOwner)
                    res.render('./chat/room_profil.pug', {
                        room_name: room.room_name,
                        description: room.description,
                        owner: user,
                        isOwner: isOwner,
                    });
                } else {
                    req.flash('danger', 'An error occured');
                    res.redirect('/chat/hub');  
                }
            });
        } else {
            req.flash('danger', 'Room doesn\'t exist');
            res.redirect('/chat/hub');
        }
    });
});

//Gets random public rooms to visite
async function GetPubRoom(nbRooms, lsPubRooms) {
    await Room.find({ pub_access: true }).catch((err) => {
        if(err) {
            return null;
        }
    }).then((rooms) => {
        if(rooms) {
            if (nbRooms >= rooms.length) {
                nbRooms = rooms.length;
            }
            for (var i = 0; i < nbRooms; i++) {
                lsPubRooms.push(rooms[Math.floor(Math.random() * rooms.length)]);
            }
        }
    });
}

//GET room access
router.get('/room/:room_name', userAuth, async (req, res) => {
    var token = tokenGene(100); 
    req.user.token = token;
    //update the user token for new connection
    await User.updateOne({_id: req.user._id}, req.user).catch((err) => {
        if (err) {
            req.flash('danger', 'Error will registrating to room');
            res.redirect('/chat/hub');
        }
    }).then(async () => {
        console.log(`User ${req.user.username} changed token for ${req.user.token}`);
        //Imbed the token in the page as a connection string to the room
        var connectionToken = `${req.user.username}/${req.params.room_name}/${token}`;
        var lsRooms = [];
        await GetPubRoom(3, lsRooms).then(() => {
            res.render('./chat/room.pug', {
                title: 'Chatroom : '+ req.params.room_name,
                rooms: lsRooms,
                token: connectionToken
            });
        });
    });
});

//POST room to go to
router.post('/hub', (req, res) => {
    res.redirect('/chat/room/'+req.body.room);
});

module.exports = router;