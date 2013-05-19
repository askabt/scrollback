var archiver = require("./archive.js"),
	irc = require("irc"),
	config = require("./config.js");

var servers = config.irc.servers, nick=config.irc.nick;


var chanIndex = {}, i, l, clients = {}, serv, chan;

//--- build an index for fast lookups.

for(serv in servers) {
	clients[serv] = connect(serv, nick, function(message) {
		archiver.add(message);
	});
	for(i=0, l=servers[serv].length; i<l; i++) {
		chan = servers[serv][i];
		chanIndex[chan.toLowerCase()] = serv;
		if(chan != '*') clients[serv].addListener('registered', (function(serv, chan) {
			return function() {
				clients[serv].join('#'+chan);
			};
		}(serv, chan)));
	}
}

function connect(server, nick, callback) {
	client =  new irc.Client(server, nick, {
		userName: 'scrollback',
		realName: 'via scrollback.io'
		, debug: true
	});
	
	function uh(s) { return s.replace(/^\#*/,''); }
	function message(type, from, to, text) {
		return {
			type: type, from: from, to: to, text: text,
			time: new Date().toISOString()
		};
	}
	
	client.addListener('error', function(message) {
		console.log("Error from " + message.server, message.args);
	});
	
	client.addListener('message', function(nick, channel, text) {
		callback(message('text', nick, uh(channel), text));
	});
	
	client.addListener('join', function(channel, from) {
		callback(message('join', from, uh(channel), ''));
	});
	
	client.addListener('part', function(channel, from, reason) {
		callback(message('part', from, uh(channel), reason));
	});
	
	client.addListener('quit', function(from, reason, channels) {
		for(i=0, l=channels.length; i<l; i++) {
			callback(message('part', from, uh(channels[i]), reason));
		}
	});
	
	return client;
}

exports.getServer = function(id) {
	var idx = id.toLowerCase();
	if(!chanIndex[idx]) {
		clients[chanIndex['*']].join('#'+id);
		chanIndex[idx] = chanIndex['*'];
	}
	return chanIndex[idx];
};

exports.connect = connect;

