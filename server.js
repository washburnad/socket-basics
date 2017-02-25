var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log('User connected via socket.io');
    var timestamp;

    socket.on('message', function (message) {
        console.log('Message received');
        console.log(message);
        message.timestamp = now.valueOf();
        io.emit('message', message);
    });


    socket.emit('message', function () {
        text: 'Welcome to the chat app'
        timestamp: now.valueOf();
    });

});

http.listen(PORT, function () {
    console.log('Server started');
});