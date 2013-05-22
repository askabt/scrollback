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

socket.on('connect', function(message) {
	if(scrollback.streams && scrollback.streams.length) {
		for(i=0; i<scrollback.streams.length; i++) {
			console.log('Joining', scrollback.streams[i]);
			socket.emit('join', scrollback.streams[i]);
		}
	}
});

socket.on('message', function(message) {
	var stream = streams[message.to];
	if(!stream.connected) stream.ready();
	if(message.type == 'join' && message.from == nick) {
		console.log('Requesting logs for ' + message.to);
		socket.emit('get', {to: message.to, until: message.time});
	} else {
		Stream.message(message);
	}
});

socket.on('error', function(message) {
	console.log(message);
});

socket.on('nick', function(n) {
	console.log("Nick updated to " + n);
	Stream.updateNicks(n)
});


