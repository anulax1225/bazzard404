const mongoose = require('mongoose');

const RoomShema =  mongoose.Schema({
    room_owner: {
        type: String,
        require: true
    },
    room_name: {
        type: String,
        required: true,
        unique: true
    },
    room_state: {
        type: Boolean,
        required: false
    },
    room_messages: {
        type: Array,
        required: false
    },
    room_users: {
        type: Array,
        required: false
    },
});

const Room = module.exports = mongoose.model('Room', RoomShema);