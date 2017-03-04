var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers (socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === 'undefined') {
        return;
    } 

    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];
        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
}

io.on('connection', function (socket) {
    console.log('User connected via socket.io');

    socket.on('disconnect', function () {
        user_data = clientInfo[socket.id] 
        if (typeof user_data !== undefined) {
            socket.leave(user_data.room);
            io.to(user_data.room).emit('message', {
                name: 'System',
                text: user_data.name + ' has left.',
                timestamp: moment(0).valueOf()
            })
            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined.',
            timestamp: moment(0).valueOf()
        });
    });

    socket.on('message', function (message) {
        console.log('Message received ' + message.text);

        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        } else {
            message.timestamp = moment().valueOf();
            io.to(clientInfo[socket.id].room).emit('message', message);            
        }

    });


    console.log('emit on connection');
    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the chat app',
        timestamp: moment().valueOf()
    });

});

http.listen(PORT, function () {
    console.log('Server started');
});