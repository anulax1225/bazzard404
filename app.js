//Required modules
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const { Server } = require('socket.io')
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const ArticleRouter = require('./routes/articles');
const UsersRouter = require('./routes/users');
const ChatRouter = require('./routes/chat')
const config = require('./config/database');
const configPassport = require('./config/passport');
const chatConsummer = require('./consumers/chatConsummer');
const webRtcStream = require('./consumers/webRtcConsumer');

//creating web app
const app = express();

//Connection to MongoDB
mongoose.connect(config.database);
var db = mongoose.connection;

//Check for db connection
db.once('open', () => {
    console.log('Connected to MangoDB');
});

//Check for db error
db.on('error', (err) => {
    console.log("An error occured in the DB.");
});

//Setting view directory and template language
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Setting express session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));

//Setting express message Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Setting parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setting passport config and Middleware
configPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

//Route to articles
app.use('/articles', ArticleRouter);
app.use('/users', UsersRouter);
app.use('/chat', ChatRouter);

//For all routes if user != null => req = user
app.get('*', (req, res, next) => {
    res.app.locals.user = req.user
    next();
});

//Home route
app.get('/', async (req, res) => {
    res.render('index', {
        title: 'Bazzard 404'
    });
});

//SSL cert and key setting
const options = {
    key: fs.readFileSync('SSL/server.key'),
    cert: fs.readFileSync('SSL/server.crt')
};

//Setting up Server to run
const server = https.createServer(options, app);
const io = new Server(server);

//Adding the consumers on top of the http server
chatConsummer(io.of('/chat'));
webRtcStream(io.of('/webrtc'));

server.listen(process.argv[2], () => {
    console.log('listening on *:' + process.argv[2]);
});
