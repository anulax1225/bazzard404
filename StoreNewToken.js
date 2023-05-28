const mongoose = require('mongoose');
const config = require('./config/database');
var Token = require('./models/token');
const tokenGene = require('./routes/strategy/tokenGenerator')

if(process.argv[2]) {
    mongoose.connect(config.database);
    for (var i = 0; i <= process.argv[2]; i++) {
        auth = new Token();
        auth.token = tokenGene(6);
        console.log('New token '+ i +' : '+ auth.token)
        auth.save().catch((err) => console.log(err));
    }
}
