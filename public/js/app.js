var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

socket.on('connect', function () {
    console.log('connected to socket io server');
    // jQuery('.messages').append('<p><strong>' + name + ' has entered ' + room + '.</strong></p>');
});

socket.on('message', function (message) {
    var momentTimestamp = moment.utc(message.timestamp);
    var $message = jQuery('.messages');

    console.log('New message(' + momentTimestamp + '): ' + message.text);

    $message.append('<p></strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
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
