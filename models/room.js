const mongoose = require('mongoose');

const RoomShema =  mongoose.Schema({
    room_owner:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: false
    },
    room_pic:{
        type: String,
        require: false
    },
    room_name:{
        type: String,
        required: true,
        unique: true
    },
    pub_access:{
        type: Boolean,
        required: false
    },
    room_messages:{
        type: Array,
        required: false
    },
    room_users:{
        type: [String],
        required: false
    },
});

const Room = module.exports = mongoose.model('Room', RoomShema);