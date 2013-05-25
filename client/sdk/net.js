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
var timeAdjustment = 0;


socket.on('connect', function(message) {
	if(scrollback.streams && scrollback.streams.length) {
		for(i=0; i<scrollback.streams.length; i++) {
			console.log('Joining', scrollback.streams[i]);
			socket.emit('join', scrollback.streams[i]);
		}
	}
});

socket.on('message', function(message) {
	var stream;
//	console.log('Message to ' + message.to, streams);
	if(message.type == 'join' && message.from == nick) {
		stream = streams[message.to];
		if(stream.isReady) return;
		console.log('Connected. Requesting missing logs for ' + message.to);
		socket.emit('get', {to: stream.id, until: message.time, since: stream.lastMessageAt, type: 'text'});
		stream.ready();
		stream.isReady = true;
	}
	else if(message.type == 'part' && message.from == nick) {
		// do nothing.
	}
	else {
		Stream.message(message);
	}
});

socket.on('error', function(message) {
	console.log(message);
});

socket.on('nick', function(n) {
	console.log("Nick updated to " + n);
	Stream.updateNicks(n);
});


