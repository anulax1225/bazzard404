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
    adminFlag:{
        type: Boolean,
        required: false
    },
    token:{
        type: String,
        required: false
    }
});

const User = module.exports = mongoose.model('UserL', UserShema);