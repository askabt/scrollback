var irc = require("./irc.js"),
	express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	archive = require("./archive.js")
	, cookie = require("cookie")
//	, user = require("./user.js")
	, test = require('fs').readFileSync(__dirname + "/client/test.html"),
	nicks = {}
	;

app.use(express.logger());
app.use(express.static(__dirname + '/client'));
app.use(express.cookieParser());
app.use(express.session({secret: "syugeheijak"}));
app.use(express.bodyParser());
app.get('/t/:stream', function(req, res) {
	res.writeHead('/test#')
	res.end();
});
//app.post('/:login', function(req, res) {
//	user.get(req.body, function(user) {
//		req.session.user = user;
//	});
//});

server.listen(7777);

//---------------------------------------------------------------

io.set('log level', 1);
io.sockets.on('connection', function(socket) {
	var clients = {},
		sid = cookie.parse(socket.handshake.headers.cookie || '')['connect.sid'],
		nick = nicks[sid] || 'guest' + Math.floor(Math.random() * 10000);
		nicks[sid] = nick;
		
		console.log(new Date() + "New connection from " + nick);
		
	/*
	 * message: { from: , to: , text: type: time: }
	 */
	
	socket.on('message', function(message) {
		if(!(client = clients[irc.getServer(message.to)])) {
			socket.emit('error', message.to + ' is not connected.');
			return;
		}
		client.say('#' + message.to, message.text);
	});
	
	socket.on('join', function(id) {
		if(!id) return;
		var server = irc.getServer(id), client = clients[server];
		if(!client) {
			clients[server] = client = irc.connect(server, nick, function(message) {
				if(client.requestedNick && message.from == client.currentNick) {
					message.from = client.requestedNick;
				}
				socket.emit('message', message);
			});
			client.currentNick = nick;
			
			client.addListener('registered', function() {
				client.join('#'+id);
			});
			client.addListener("nick", function(oldnick, newnick) {
				if(oldnick == client.currentNick) {
					client.currentNick = newnick;
					if(newnick == client.requestedNick) client.requestedNick = null;
					console.log(server, "says:", oldnick, "changed to", newnick);
					// Go change all the other servers also. Might be redundant.
					changeNicks(newnick);
				}
			});
		} else {
			client.join('#'+id);
		}
	});
	
	socket.on('get', function(qo) {
		console.log("Getting", qo);
		archive.get(qo, function(data) {
			var i, l;
			for(i=0, l = data.length; i<l; i++) {
				socket.emit('message', data[i]);
			}
		});
	});
	
	socket.emit('nick', nick);
	socket.on('nick', changeNicks);

	function changeNicks(n) {
		var i, pendingRequests = false;
		for(i in clients) {
			if((clients[i].requestedNick || clients[i].currentNick) != n) {
				console.log("asking",i,"to change nick to",n);
				clients[i].send('NICK', n);
				clients[i].requestedNick = n;
				pendingRequests = true;
			}
		}
		nick = n;
		nicks[sid] = nick;
		socket.emit('nick', nick); // Sometimes the server initiates the change.
	};
	
	socket.on('part', function(id) {
		var client;
//		console.log("Parting", id);
		if((client = clients[irc.getServer(id)])) {
			client.part("#" + id);
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

process.on('uncaughtException', function(error) {
	// Keep from crashing. Fix this.
	console.log("UNCAUGHT EXCEPTION", error.stack);
});
