var User = require('../models/user');
var Room = require('../models/room');
const moment = require('moment');
var lsUserSocket = [];

module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on('join_room', (msg) => {
            User.findOne({username: msg.username}).catch((err) => {
                if(err) {
                    socket.emit('disconnect_from_chat');
                }
                }).then((user) => {
                    if(user) {
                        if (user.token === msg.token) {
                            Room.findOne({room_name: msg.room}).then((room) => {
                                if (room) {

                                    io.to(msg.room).emit('chat_message', {
                                        sender: 'BAZZARD BOT',
                                        text: `User ${user.username} joined the room.`,
                                        time: moment().format('h:mm a')
                                    });

                                    lsUserSocket.push({
                                        user: user,
                                        room: msg.room,
                                        socket: socket
                                    })

                                    socket.join(msg.room);

                                    socket.emit('chat_message', {
                                        sender: 'BAZZARD BOT',
                                        text: `Welcome to room ${msg.room}.`,
                                        time: moment().format('h:mm a')
                                    })
                                    console.log(`User ${user.username} joined room ${msg.room}`);

                                    socket.on('chat_message', (msg) => {
                                        console.log(`message: ${msg.text} send, from ${msg.sender} => to ${msg.room}`)
                                        io.to(msg.room).emit('chat_message', {
                                            sender: msg.sender,
                                            text: msg.text,
                                            time: moment().format('h:mm a')
                                        });
                                    });
                            
                                    socket.on('disconnect', () => {
                                        i = 0;
                                        lsUserSocket.forEach(UserSocket => {
                                            if (UserSocket.socket == socket) {
                                                console.log(`${UserSocket.user.username} disconnected from room ${UserSocket.room}`);
                                                lsUserSocket[i] = null;
                                            }
                                            i++
                                        });
                                        console.log('Unknown user disconnected');
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

