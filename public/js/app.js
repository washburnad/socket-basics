var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

jQuery('h1#room-name').text(room);

socket.on('connect', function () {
    console.log('connected to socket io server');

    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp);
    var $messages = jQuery('.messages');
    var $message = jQuery('<li class="list-group-item"></li>');

    console.log('New message(' + momentTimestamp + '): ' + message.text);

    $message.append('<p></strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
    $messages.append($message);
})

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (e) {
    e.preventDefault();
    var $messageField = $form.find('input[name=message]')

    socket.emit('message', {
        name: name,
        text: $messageField.val()
    });

    $messageField.val('');
});
