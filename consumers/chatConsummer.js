//Core of the chat routing 

var User = require('../models/user');
var Room = require('../models/room');
var Msg = require('../models/message');

const moment = require('moment');

//Make socket join a room 
function joinRoom(socket, req) {
    socket.join(req.room);

    socket.emit('chat_message', {
        sender: 'BAZZARD BOT',
        text: `Welcome to room ${req.room}.`,
        time: moment().unix()
    })
}

//Messages to the database
async function saveMsg(msg) {
    var message = new Msg({
        sender: msg.sender,
        receiver: msg.room,
        time: moment().unix(),
        text: msg.text
    });
    await message.save();
}

//fetching the messages from the database to client
async function fetchMessages(socket, req) {
    await Msg.find({ receiver:req.room }).sort({ 'time': 'asc' }).then((messages) => {
        if(messages) {
            socket.emit('fetch_messages', messages);
        }
    });
}

async function SetSocketBehavior(io, socket) {
    socket.on('chat_message', async (msg) => {
        console.log(`message: ${msg.text} send, from ${msg.sender} => to ${msg.room}`)
        await saveMsg(msg);
        io.to(msg.room).emit('chat_message', {
            sender: msg.sender,
            text: msg.text,
            time: moment().unix()
        });
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
}

function isInAccessList(room_list, user) {
    for (room_user in room_list) {
        if (room_user == user._id) {
            return true;
        }
    }
    return false
}

//Setting global access to chat API 
module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('join_room', async (req) => {
            //Find the user object by username
            await User.findOne({ username: req.username }).catch((err) => {
                if(err) {
                    //If false username
                    socket.emit('user_not_found');
                }
                }).then(async (user) => {
                    //If user exist
                    if(user) {
                        //authentifie user with token
                        if (user.token === req.token) {
                            //Find the room to connect
                            await Room.findOne({room_name: req.room}).then(async (room) => {
                                if (room) {
                                    if (room.pub_access || isInAccessList(room.room_users, user) || room.room_owner == user._id) {
                                        //Notifice room of the new users loged in
                                        io.to(req.room).emit('chat_message', {
                                            sender: 'BAZZARD BOT',
                                            text: `User ${user.username} joined the room.`,
                                            time: moment().format()
                                        }); 
                                        //Join the socket and the room
                                        joinRoom(socket, req);
                                        await fetchMessages(socket, req);
                                        //Setting up behavior of the socket
                                        await SetSocketBehavior(io, socket);

                                        console.log(`User ${user.username} joined room ${req.room}`);
                                    } else {
                                        socket.emit('blocked_room');
                                    }

                                }  else {
                                    socket.emit('room_not_found');
                                } 
                            });
                        } else {
                            socket.emit('user_token_incorrect');
                        }
                    } else {
                        socket.emit('user_not_found');
                    }
                });
        });
    });
};

