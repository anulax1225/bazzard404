var Token = require('./models/token');
const tokenGene = require('./routes/strategy/tokenGenerator')

module.exports = (nb) => { 
    for (var i = 0; i <= nb; i++) {
        auth = new Token();
        auth.token = tokenGene(6);
        console.log('New token '+ i +' : '+ auth.token)
        auth.save().catch((err) => console.log(err));
    }
}