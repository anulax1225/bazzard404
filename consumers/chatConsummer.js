var User = require('../models/user');
var Room = require('../models/room');
var Msg = require('../models/message');

const moment = require('moment');

function joinRoom(socket, req) {
    socket.join(req.room);

    socket.emit('chat_message', {
        sender: 'BAZZARD BOT',
        text: `Welcome to room ${req.room}.`,
        time: moment().unix()
    })
}

async function saveMsg(msg) {
    var message = new Msg({
        sender: msg.sender,
        receiver: msg.room,
        time: moment().unix(),
        text: msg.text
    });
    await message.save();
    console.log('message saved.')
}

async function fetchMessages(socket, req) {
    await Msg.find({ receiver:req.room }).sort({ 'time': 'asc' }).then((messages) => {
        if(messages) {
            socket.emit('fetch_messages', messages);
            console.log('messages send' + messages)
        }
    });
}

module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on('join_room', (req) => {
            //Find the user object by username
            User.findOne({username: req.username}).catch((err) => {
                if(err) {
                    //If false username
                    socket.emit('disconnect_from_chat');
                }
                }).then(async (user) => {
                    //If user exist
                    if(user) {
                        //authentifie user with token
                        if (user.token === req.token) {
                            //Find the room to connect
                            await Room.findOne({room_name: req.room}).then(async (room) => {
                                if (room) {
                                    //Notifice room of the new user loged in
                                    io.to(req.room).emit('chat_message', {
                                        sender: 'BAZZARD BOT',
                                        text: `User ${user.username} joined the room.`,
                                        time: moment().format()
                                    });

                                    //Join the socket and the room
                                    joinRoom(socket, req);
                                    await fetchMessages(socket, req);
                                    console.log(`User ${user.username} joined room ${req.room}`);

                                    //Setting up behavior of the socket
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

                                }  else {
                                    socket.emit('disconnect_from_chat');
                                } 
                            });
                        } else {
                            socket.emit('disconnect_from_chat');
                        }
                    } else {
                        socket.emit('disconnect_from_chat');
                    }
                });
        });
    });
};

