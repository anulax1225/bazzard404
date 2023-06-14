const socket = io();

//Getting all the neaded componants of the page
var divMessages = document.getElementById('chat-messages');
var btnLeave = document.getElementById('leave-btn');
var msgInput = document.getElementById('msgInput');
var msgForm = document.getElementById('messageForm'); 

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
    alert('Disconneted from chat');
    window.location.href = '/chat/hub';
});
socket.on('disconnect_from_chat', () => {
    alert('Disconneted from chat');
    window.location.href = '/chat/hub';
});

socket.on('blocked_room', () => {
    alert('Unauthorized access to the chat room');
    window.location.href = '/chat/hub';
});

initRoom();