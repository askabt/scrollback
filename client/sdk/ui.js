var streams = {}, nick = null,
	$ = function(id) {
		return document.getElementById(id);
	}, $$ = getByClass;

// ---- Initialize ----

DomReady.ready(function() {
	addStyles(css);
	addEvent(window, 'resize', Stream.position);
});

// ---- The Stream constructor ----

function Stream(id) {
	var self = this;
	self.id = id;
	self.stream = JsonML.parse(["div", {
		'class': 'scrollback-stream',
		onclick: function() { self.select(); }
	},
		["div", {
			'class': 'scrollback-title',
			onclick: function() { self.show(); }
		}, id,
			["div", {
				'class': 'scrollback-close',
				onclick: function() { self.close(); }
			}, '×'],
			["div", {
				'class': 'scrollback-hide',
				onclick: function(event) {
					
					self.hide();
					if(event.stopPropagation) event.stopPropagation();
					else event.cancelBubble = true;
				}
			}, '_']
		],
		["div", {'class': 'scrollback-toolbar'},
			["div", {
				'class': 'scrollback-toolbtn scrollback-embed',
				onclick: function() { self.embed(); }
			}, 'F'],
			["div", {
				'class': 'scrollback-toolbtn scrollback-embed',
				onclick: function() { self.embed(); }
			}, 'M'],
			["div", {
				'class': 'scrollback-toolbtn scrollback-embed',
				onclick: function() { self.embed(); }
			}, 'L'],
			["div", {
				'class': 'scrollback-toolbtn scrollback-link',
				onclick: function() { self.embed(); }
			}, '://'],
			["div", {
				'class': 'scrollback-toolbtn scrollback-embed',
				onclick: function() { self.embed(); }
			}, '</>']
		],
		["div", {'class': 'scrollback-overlay'}],
		["div", {'class': 'scrollback-log'}],
		["form", {
			'class': 'scrollback-send',
			onsubmit: function(event) {
				if(event.preventDefault) event.preventDefault();
				self.send();
				return false;
			}
		},
			["input", {
				'class': 'scrollback-nick',
				onchange: function() { self.rename(); },
				value: nick
			}],
			["input", {'class': 'scrollback-text'}],
			["button", {type: 'submit', 'class': 'scrollback-hidden'}, "Send"]
		]
	], function(el) {
		
		console.log("callback", el.className);
		if(el.className == 'scrollback-log') self.log = el;
		else if(el.className == 'scrollback-nick') self.nick = el;
		else if(el.className == 'scrollback-hidebtn') self.hidebtn = el;
		else if(el.className == 'scrollback-text') self.text = el;
		return el;
	});
	
	console.log("Appending...", self);
	document.body.appendChild(self.stream);
};

Stream.prototype.close = function (){
	delete streams[this.id];
	document.body.removeChild(this.stream);
};

Stream.prototype.hide = function() {
	console.log("hiding");
	this.stream.className = this.stream.className + " scrollback-stream-hidden";
	this.hidebtn.innerText = '‾';
};

Stream.prototype.show = function() {
	console.log("showing");
	this.stream.className = this.stream.className.replace(/\sscrollback-stream-hidden/g, '');
	this.hidebtn.innerText = '_';
};

Stream.prototype.send = function (){
	var message = {
		from: nick,
		to: this.id,
		text: this.text.value,
		type: 'text',
		time: new Date()
	};
	socket.emit('message', message);
	this.text.value = '';
	Stream.message(message);	
};

Stream.prototype.rename = function() {
	var n = this.nick.value;
	socket.emit('nick', n);
	Stream.updateNicks(n);
};

Stream.prototype.select = function() {
	var ss = $$(document, "scrollback-stream"), i, l = ss.length;
	for(i=0; i<l; i++) {
		ss[i].className = ss[i].className.replace(/\sscrollback-stream-selected/g, '');
	}
	this.stream.className = this.stream.className + ' scrollback-stream-selected';
	Stream.position();
};

// ---- Static methods ----

Stream.message = function(message) {
	var el, str, bot;
	console.log('Inserting a message', message);
	switch(message.type) {
		case 'text':
			el = [
				[ "span", { 'class': 'scrollback-message-nick' }, message.from ],
				[ "span", { 'class': 'scrollback-message-separator'}, ': '],
				[ "span", { 'class': 'scrollback-message-separator'}, message.text ]
			];
			break;
		case 'join':
			// el = [["span", message.from + ' joined.']];
			break;
		case 'part':
			/* el = [["span", message.from + ' left' + (
				message.text? ' (' + message.text + ')': '.'
			)]];*/
			break;
		default:
			el = [["span", message.text]];
	}
	
	if(!el) return;
	
	el = JsonML.parse(["div", {
		'class': 'scrollback-message scrollback-message-' + message.type
	}].concat(el));
	str = Stream.get(message.to);
	str.log.appendChild(el);
	el.scrollIntoView(false);
};

Stream.get = function(id) {
	var holder;
	id = id.toLowerCase();
	if(streams[id]) {
		return streams[id];
	} else {
		console.log("Adding a stream " + id);
		streams[id] = new Stream(id);
		Stream.position();
		return streams[id];
	}
};

Stream.updateNicks = function(n) {
	var i, stream;
	console.log("Updating all the nicks.");
	for(i in streams) {
		stream = streams[i];
		stream.nick.value = n;
	}
	nick = n;
}

Stream.position = function() {
	console.log("Repositioning streams.");
	var ss = $$(document, "scrollback-stream"), i, l=ss.length,
		step = 1, z=0,
		scrw = window.innerWidth || document.documentElement.clientWidth ||
			document.getElementsByTagName('body')[0].clientWidth,
		colw = Math.min(scrw, maxWidth),
		pitch = Math.min((scrw - colw - 2*margin)/l, 420), col;
	
	for(i=0; i<l; i++) {
		col = ss[i];
		col.style.right = (margin + i*pitch) + 'px';
		col.style.width = colw + 'px';
		col.style.zIndex = z + l;
		if(col.className.indexOf('scrollback-stream-selected') != -1) step = -1;
		z = z + step;
	}
}

// ---- JsonML Templates ----


// ---- CSS styles to insert ----

var maxWidth = 400, maxHeight = 400, maxGap = 20, margin = 40;

var css = {
	".scrollback-hidden": { position: "absolute", visibility: "hidden" },

	".scrollback-stream": {
		"position": "fixed",
		"width": "360px", "height": "360px", "bottom": "0px",
		"background": "#fff",
		"boxShadow": "0px 0px 8px 0 #000",
		"boxSizing": "border-box", "webkitBoxSizing": "border-box",
		"mozBoxSizing": "border-box", "msBoxSizing": "border-box",
		"oBoxSizing": "border-box",
		"fontSize": "16px",
		"transition": "all 0.2s ease-out",
		"webkitTransition": "all 0.2s ease-out", "mozTransition": "all 0.2s ease-out",
		"oTransition": "all 0.2s ease-out", "msTransition": "all 0.2s ease-out"
	},
	".scrollback-stream-hidden": {
		"height": "40px !important"
	},
		".scrollback-close, .scrollback-hide": {
			float: "right", width: "40px",
			height: "40px", cursor: "pointer", lineHeight: "40px",
			textAlign: "center", color: "#fff"
		},
		".scrollback-title, .scrollback-toolbar": {
			"height": "40px", "background": "#ccc",
			lineHeight: "40px", paddingLeft: "10px",
			left: "0", right: "0", position: "absolute"
		},
			".scrollback-title": {
				background: "#000", color: "#fff", zIndex: 9997,
				top: "0", height: "40px"
			},
			".scrollback-toolbar": {background: "#eee", height: "40px", top: "40px" },
			".scrollback-toolbtn": {
				float: "left", height: "40px", lineHeight: "40px",
				width: "40px", cursor: "pointer", textAlign: "center",
				borderRadius: "3px"
			},
			".scrollback-toolbtn:hover": { background: "#fff" },
		".scrollback-log": {
			"position": "absolute", "top": "80px",
			"bottom": "40px", "left": "0", "right": "0",
			"overflowY": "auto", "overflowX": "hidden",
			"background": "#fff",
		},
		".scrollback-message": {
			"overflow": "hidden", padding: "4px",
			"transition": "all 0.2s ease-out",
			"webkitTransition": "all 0.2s ease-out", "mozTransition": "all 0.2s ease-out",
			"oTransition": "all 0.2s ease-out", "msTransition": "all 0.2s ease-out"
		},
		".scrollback-message-start": { "height": "0px", },
		".scrollback-message-join, .scrollback-message-part": { "color": "#999", },
	
	".scrollback-send": {
		"position": "absolute", "padding": "0", "margin": "0",
		"bottom": "0px", "left": "0", "right": "0", "height": "40px",
		background: "#eee"
	},
		".scrollback-nick, .scrollback-text": {
			"display": "block", "border": "none",
			"boxSizing": "border-box", "webkitBoxSizing": "border-box",
			"mozBoxSizing": "border-box", "msBoxSizing": "border-box",
			"oBoxSizing": "border-box",
			lineHeight: "28px", fontSize: "16px",
			"padding": "4px", "borderRadius": "0 0 3px 3px",
			"position": "absolute", "top": "2px;",
			"margin": "0"
		},
		".scrollback-nick:focus, .scrollback-text:focus": {
			outline: "none"
		},
		".scrollback-nick": { "left": "2px", "width": "96px", color: "#999" },
		".scrollback-text": { "right": "2px", "left": "100px" }
	
};
