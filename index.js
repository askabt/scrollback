var irc = require("./irc.js"),
	express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	archive = require("./archive.js"),
	cookie = require("cookie")
//	, user = require("./user.js")
	, test = require('fs').readFileSync(__dirname + "/client/test.html"),
	nicks = {},
	users={}
	;

//app.use(express.logger());
app.use(express.cookieParser());
app.use(express.session({secret: "syugeheijak"}));
app.use(express.bodyParser());
app.get('/t/:stream', function(req, res) {
	res.writeHead('/test#')
	res.end();
});
app.use(express.cookieParser());
app.use(express.static(__dirname + '/client'));
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

		console.log(sid);
	console.log("CurrentNick="+nick);
	if(users[nick] && users[nick].clients!==undefined){
		clients=users[nick].clients;
		if(users[nick].outTimeout!==undefined){
			clearTimeout(users[nick].outTimeout);
		}
	}
	else{
		console.log("new user");
	}
	
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
//			console.log("client obj not found for the channel" +id+" and server "+server);
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
//					console.log(server, "says:", oldnick, "changed to", newnick);
					// Go change all the other servers also. Might be redundant.
					 changeNicks(newnick);
				}
			});
		} else {
//			console.log("client obj found for the channel" +id+" and server "+server);
			console.log("joining "+id);


			//ugly hack to handle the request to join being made before getting registered,
			client.addListener('registered', function() {
				client.join('#'+id);
				socket.emit("message",{type:"join",to:id,from:nick,text:"text",time:new Date().getTime()});
			});


			client.join('#'+id);
			socket.emit("message",{type:"join",to:id,from:nick,text:"teaxt",time:new Date().getTime()});
		}
		users[nick]={};
		users[nick].clients=clients;
	//	console.log("joined",users[nick].clients);
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
		var oldNick=nicks[sid];


		console.log("request to change the nick from "+nicks[sid]+" to "+n);
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

		if(oldNick!==n){
			//console.log("changing the nick of sid to new one",nicks[sid],users[oldNick]);
			users[nick]={};
			//console.log("creating new user entry for the new nick",users[nick]);
			users[nick].clients=users[oldNick].clients;
			//console.log("copying the client objects from the only user object to the new ones.",users[nick]);
		}
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
		console.log(nick,users);
		var toDisconnect=nick;
		users[nick].outTimeout=setTimeout(function(){
			var clients=users[toDisconnect].clients;
			for(i in clients) {
				clients[i].disconnect("Scrollback says bye..........");
				delete clients[i]; // Speed up GC?
			}
		},60000);
	});
});

process.on('uncaughtException', function(error) {
	// Keep from crashing. Fix this.
	console.log("UNCAUGHT EXCEPTION", error.stack);
});
