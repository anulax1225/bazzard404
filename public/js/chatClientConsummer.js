const socket = io('/chat');

//Getting all the neaded componants of the page
var divMessages = document.getElementById('chat-messages');
var btnLeave = document.getElementById('leave-btn');
var btnRoom = document.getElementById('room-profil-btn');
var msgInput = document.getElementById('msgInput');
var msgForm = document.getElementById('messageForm'); 
var btnCall = document.getElementById('call-btn');

var username, room, token = '';

//Initilisasing a new connection 
//with the Imbeded connection string
function initRoom() {
    var metaToken = document.getElementById('token'); 
    var components = metaToken.getAttribute('content').split('/');
    username = components[0];
    room = components[1];
    token = components[2];
    socket.emit('join_room', {
        username: username,
        room: room,
        token: token
    });
}

//Outputing message to the users interface
function outputMessageDOM(msg) {
    var div = document.createElement('div');
    var pMeta = document.createElement('p');
    var span = document.createElement('span');
    var pText = document.createElement('p');

    div.classList.add('message');
    pMeta.classList.add('meta');
    pText.classList.add('text');

    pText.textContent = msg.text;
    pMeta.textContent = msg.sender;
    span.textContent = msg.time;

    pMeta.appendChild(span)
    div.appendChild(pMeta);
    div.appendChild(pText);
    divMessages.appendChild(div);
    divMessages.scrollTo(0, divMessages.scrollHeight);
}

function alertRd(msg, url = '/chat/hub') {
    alert(msg);
    window.location.href = url;
}

//When the client submits a new message the socket emit it to the server
msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var msgData = msgInput.value;
    msgInput.value = '';
    socket.emit('chat_message', {
        sender: username,
        room: room,
        text: msgData,
    });
})

//Go to voice call
btnCall.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = `/chat/room/${room}/vocal`;
});

//Go to room profile
btnRoom.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = `/chat/room/${room}/profil`;
});

//Leave room
btnLeave.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/chat/hub';
});

//Get all the previous messages from room
socket.on('fetch_messages', (msgs) => {
    msgs.forEach(msg => {
        outputMessageDOM(msg);
    });
});

//When a message is send
socket.on('chat_message', (msg) => {
    outputMessageDOM(msg);
});

//When disconnected redirect to /chat/hub 
socket.on('disconnect', () => {
    alertRd('Disconneted from chat');
});

socket.on('user_not_found', () => {
    alertRd('User authentification failed');
});

socket.on('user_token_incorrect', () => {
    alertRd('User authentification failed');
});

socket.on('room_not_found', () => {
    alertRd('Room not found');
});

socket.on('blocked_room', () => {
    alertRd('Unauthorized access to the chat room');
});

initRoom();