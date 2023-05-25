const mongoose = require('mongoose');

var articleShema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    body:{
        type: String,
        required: true
    },
});

var Article = module.exports = mongoose.model('Article', articleShema);