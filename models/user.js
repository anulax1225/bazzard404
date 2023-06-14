const mongoose = require('mongoose');


const UserShema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    user_pic:{
        type: String,
        required: false
    },
    token:{
        type: String,
        required: false
    }
});

const User = module.exports = mongoose.model('User', UserShema);