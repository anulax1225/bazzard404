const mongoose = require('mongoose');

const TokenShema =  mongoose.Schema({
    token: {
        type: String,
        required:  true
    },
});

const Token = module.exports = mongoose.model('Token', TokenShema);