/*
 * This is version 1 of  the client side scrollback SDK.
 *
 * @author Aravind
 * copyright (c) 2012 Askabt Pte Ltd
 *
 *
 * Dependencies:
 *   - addEvent.js
 *   - domReady.js
 *   - getByClass.js
 *   - jsonml2.js
 */
var socket = io.connect(location.protocol + scrollback.server);

socket.on('message', function(message) {
	if(message.type == 'join' && message.from == nick) {
		message.type = 'connection';
		message.text = 'Connected to ' + message.to + '.';
		console.log('requesting logs' + message.to);
		socket.emit('get', {to: message.to, until: message.time});
	} else {
		Stream.message(message);
	}
});

socket.on('error', function(message) {
	alert(message);
});

socket.on('nick', function(n) {
	console.log("Nick updated to " + n);
	nick = n;
	Stream.updateNicks(n)
});


