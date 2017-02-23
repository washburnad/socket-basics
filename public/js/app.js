var socket = io();

socket.on('connect', function () {
    console.log('connected to socket io server');
});

socket.on('message', function (message) {
    console.log(message);
    console.log('New message: ' + message.text);

    jQuery('.messages').append('<p>' + message.text + '</p>');
})

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (e) {
    e.preventDefault();
    var $messageField = $form.find('input[name=message]')

    socket.emit('message', {
        text: $messageField.val()
    });

    $messageField.val('');
});