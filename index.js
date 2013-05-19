var irc = require("./irc.js"),
	express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	archive = require("./archive.js");

app.use(express.logger());
app.use(express.cookieParser());
app.use(express.session({secret: "syugejheiak"}));
app.use(express.bodyParser());
app.get('/irc/:server', function() {
});
app.get('/irc/:server/channel', function() {
})
app.use(express.static(__dirname + '/client'));

server.listen(7777);

//---------------------------------------------------------------

io.set('log level', 1);
io.sockets.on('connection', function(socket) {
	var clients = {}, nick = 'guest' + Math.floor(Math.random() * 1000);
	
	socket.on('message', function(message) {
		if(!(client = clients[irc.getServer(message.to)])) {
			socket.emit('error', message.to + ' is not connected.');
			return;
		}
		client.say('#' + message.to, message.text);
	});
	
	socket.on('join', function(id) {
		var server = irc.getServer(id), client = clients[server];
		if(!client) {
			clients[server] = client = irc.connect(server, nick, function(message) {
				socket.emit('message', message);
			});
			client.addListener('registered', function() {
				client.join('#'+id);
			});
		} else {
			client.join('#'+id);
		}
	});
	
	socket.on('get', function(qo) {
		archive.get(qo, function(err, data) {
			var i, l;
			if(err) {
				console.log(err); return;
			}
			console.log("Got " + data.length + " messages from archive.");
			for(i=0, l = data.length; i<l; i++) {
				socket.emit('message', data[i]);
			}
		});
	});
	
	socket.emit('nick', nick);
	socket.on('nick', function(n) {
		var i;
		nick = n;
		for(i in clients) {
			console.log("Sending NICK message", nick);
			clients[i].send('NICK', nick);
		}
	});
	
	socket.on('disconnect', function() {
		var i;
		for(i in clients) {
			clients[i].disconnect();
			delete clients[i]; // Speed up GC?
		}
	});
});


