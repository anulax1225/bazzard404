const mongoose = require('mongoose');
const config = require('./config/database');
const token = require('./models/token');
var Token = require('./models/token');
const tokenGene = require('./routes/strategy/tokenGenerator');

mongoose.connect(config.database);
var db = mongoose.connection;

async function manageToken() {
    if (!process.argv[2]) {
        console.log("Specifie the action. \nYou can use node BtokManager -help to have more info.");
        process.exit(1);
    }
    if (process.argv[2] == "-store") {
        if (!process.argv[3]) {
            console.log("Specifie the number of new token to make.");
            process.exit(1);
        }
        for (var i = 0; i <= process.argv[3]; i++) {
            var auth = new Token();
            auth.token = tokenGene(6);
            
            try {
                await auth.save().then(() => console.log(`New token ${i} : ${auth.token}`));
            } catch(err) {
                console.log(err)
                console.log(`Error while registering token ${i}.`)
            }
        }
        process.exit(0);
    } else if (process.argv[2] == "-get") {
        Token.find({}).catch((err) => console.log(err)).then((tokens) => {
            if(tokens) {
                var length;
                if(process.argv[3] && process.argv[3] < tokens.length) {
                    length = process.argv[3];
                } else {
                    length = tokens.length
                }
                for (var i = 0; i < length; i++) {
                    console.log(`Token ${i} : ${tokens[i].token}`)
                }
            } else {
                console.log('No activation token set.');
            }
            process.exit(0);
        });
    } else if (process.argv[2] == "-help") {
        console.log('\n  ______  ______  __  __   ______  __   __\n /\\__  _\\/\\  __ \\/\\ \\/ /  /\\  ___\\/\\ "-.\\ \\\n \\/_/\\ \\/\\ \\ \\/\\ \\ \\  _"-.\\ \\  __\\\\ \\ \\-.  \\\n    \\ \\_\\ \\ \\_____\\ \\_\\ \\_\\\\ \\_____\\ \\_\\\\"\\_\\\n  __ \\/_/_ \\/_____/\\/_/\\/_/ \\/_____/\\/_/_\\/_/______  ______\n /\\ "-./  \\/\\  __ \\/\\ "-.\\ \\/\\  __ \\/\\  ___\\/\\  ___\\/\\  == \\\n \\ \\ \\-./\\ \\ \\  __ \\ \\ \\-.  \\ \\  __ \\ \\ \\__ \\ \\  __\\\\ \\  __<\n  \\ \\_\\ \\ \\_\\ \\_\\ \\_\\ \\_\\\\"\\_\\ \\_\\ \\_\\ \\_____\\ \\_____\\ \\_\\ \\_\\\n   \\/_/  \\/_/\\/_/\\/_/\\/_/ \\/_/\\/_/\\/_/\\/_____/\\/_____/\\/_/ /_/');
        console.log('');
        console.log('Manage your activations tokens with "BtokManager.js"');
        console.log('EXAMPLE:');
        console.log('----------');
        console.log('node BtokManager [-get | -store nbToken]');
        console.log('OPTIONS:');
        console.log('----------');
        console.log('-get : returns all the valid token.');
        console.log('-store : permits you to generate new token \n\t nbToken : specificie the number of tokens needed')
        process.exit(0);
    }
}
db.once('open', manageToken);
db.on('error', err => console.log(err));
