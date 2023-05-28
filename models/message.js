const mongoose = require('mongoose');

var msgShema = mongoose.Schema({
    sender:{
        type: String,
        required: true
    },
    receiver:{
        type: String,
        required: true
    },
    time:{
        type: Number,
        required: true
    },
    text:{
        type: String,
        required: true
    },
});

var Message = module.exports = mongoose.model('Message', msgShema);