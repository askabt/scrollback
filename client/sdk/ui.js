var streams = {}, nick = null,
	$ = function(id) {
		return document.getElementById(id);
	}, $$ = getByClass;

// ---- Initialize ----

DomReady.ready(function() {
	var i, stream;
	
	addStyles(css);
	addEvent(window, 'resize', Stream.position);
	
	if(scrollback.streams && scrollback.streams.length) {
		for(i=0; i<scrollback.streams.length; i++) {
			stream = Stream.get(scrollback.streams[i]);
			stream.hide();
		}
	}
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
				onclick: function() { self.login(); }
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
				value: nick, disabled: true
			}],
			["div", {'class': 'scrollback-text-wrap'}, ["input", {
				'class': 'scrollback-text',
				value: 'Connecting...', disabled: true
			}]],
			["button", {type: 'submit', 'class': 'scrollback-hidden'}, "Send"]
		],
		["a", {href: "http://scrollback.io", "class": "scrollback-poweredby", target: "_blank"}]
	], function(el) {
		if(el.className == 'scrollback-log') self.log = el;
		else if(el.className == 'scrollback-nick') self.nick = el;
		else if(el.className == 'scrollback-hide') self.hidebtn = el;
		else if(el.className == 'scrollback-text') self.text = el;
		else if(el.className == 'scrollback-send') self.sendfrm = el;
		return el;
	});
	
	self.connected = false;
	document.body.appendChild(self.stream);
};

Stream.prototype.close = function (){
	delete streams[this.id];
	document.body.removeChild(this.stream);
};

Stream.prototype.hide = function() {
	this.stream.className = this.stream.className + " scrollback-stream-hidden";
	this.hidebtn.innerText = '‾';
};

Stream.prototype.show = function() {
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

Stream.prototype.login = function() {
	var w = window.open('http://' + scrollback.server + '/login.html', 'login',
		'height=320,width=480,centerscreen');
}

Stream.prototype.ready = function() {
	this.nick.disabled = false;
	this.text.disabled = false;
	this.text.value = '';
	console.log(this.id + "  is ready");
}

// ---- Static methods ----

Stream.message = function(message) {
	var el, str, bot;
	switch(message.type) {
		case 'text':
			el = [
				[ "span", {
					'class': 'scrollback-message-nick'
				}, message.from ],
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
		'class': 'scrollback-message scrollback-message-' + message.type,
		'style': { 'borderLeftColor': hashColor(message.from) }
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
		streams[id] = new Stream(id);
		Stream.position();
		return streams[id];
	}
};

Stream.updateNicks = function(n) {
	var i, stream;
	for(i in streams) {
		stream = streams[i];
		stream.nick.value = n;
	}
	nick = n;
}

Stream.position = function() {
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

// --- color for names ---

function hashColor(name) {
	function hash(s) {
		var h=1, i, l;
		for (i=0, l=s.length; i<l; i++) {
			h = (Math.abs(h<<(7+i))+s.charCodeAt(i))%765;
		}
		return h;
	}
	
	function color(h) {
		// h must be between [0, 764] inclusive
		
		function hex(n) {
			var h = n.toString(16);
			h = h.length==1? "0"+h: h;
			return h;
		}
		
		function rgb(r, g, b) {
			return "#" + hex(r) + hex(g) + hex(b);
		}
		
		if(h<255) return rgb(255-h, h, 0);
		else if(h<510) return rgb(0, 510-h, h-255);
		else return rgb(h-510, 0, 765-h);
	}
	
	return color(hash(name));
}

// ---- JsonML Templates ----


// ---- CSS styles to insert ----

var maxWidth = 400, maxHeight = 400, maxGap = 20, margin = 40;

var css = {
	".scrollback-hidden": { position: "absolute", visibility: "hidden" },

	".scrollback-stream": {
		"position": "fixed",
		"width": "480px", "height": "480px", "bottom": "0px",
		"background": "#333", color: "#fff",
		"boxShadow": "0px 2px 8px 0 rgba(0,0,0,0.5)",
		"boxSizing": "border-box", "webkitBoxSizing": "border-box",
		"mozBoxSizing": "border-box", "msBoxSizing": "border-box",
		"oBoxSizing": "border-box",
		"fontSize": "12px", lineHeight: "14px",
		"transition": "all 0.2s ease-out",
		"webkitTransition": "all 0.2s ease-out", "mozTransition": "all 0.2s ease-out",
		"oTransition": "all 0.2s ease-out", "msTransition": "all 0.2s ease-out"
	},
	".scrollback-stream-hidden": {
		"height": "40px !important"
	},
		".scrollback-stream-hidden .scrollback-hide": { display: "none" },
		".scrollback-close, .scrollback-hide": {
			float: "right", width: "48px",
			height: "48px", cursor: "pointer", lineHeight: "48px",
			textAlign: "center", color: "#fff"
		},
		".scrollback-close:hover, .scrollback-hide:hover": {
			background: "#333", fontWeight: "bold"
		},
		".scrollback-title, .scrollback-toolbar": {
			"height": "48px", "background": "#ccc",
			lineHeight: "48px", paddingLeft: "10px",
			left: "0", right: "0", position: "absolute",
			fontWeight: "bold"
		},
			".scrollback-title": {
				background: "#000", color: "#fff", zIndex: 9997,
				top: "0", height: "48px"
			},
			".scrollback-toolbar": {
				background: "#eee", height: "40px", top: "40px",
				display:"none"
			},
			".scrollback-toolbtn": {
				float: "left", height: "40px", lineHeight: "40px",
				width: "40px", cursor: "pointer", textAlign: "center",
				borderRadius: "3px"
			},
			".scrollback-toolbtn:hover": { background: "#fff" },
		".scrollback-log": {
			"position": "absolute", "top": "48px",
			"bottom": "80px", "left": "0", "right": "0",
			"overflowY": "auto", "overflowX": "hidden",
			"background": "#333", color: "#fff"
		},
			".scrollback-message": {
				"overflow": "hidden", padding: "2px 4px 2px 48px",
				"transition": "all 0.2s ease-out", textIndent: "-40px",
				"webkitTransition": "all 0.2s ease-out", "mozTransition": "all 0.2s ease-out",
				"oTransition": "all 0.2s ease-out", "msTransition": "all 0.2s ease-out",
				"borderLeft": "4px solid #eee"
			},
			".scrollback-message-nick": { "color": "#ccc" },
			".scrollback-message-start": { "height": "0px", },
			".scrollback-message-join, .scrollback-message-part": { "color": "#999", },
	".scrollback-send": {
		"position": "absolute", "padding": "0", "margin": "0",
		"bottom": "24px", "left": "0", "right": "0", "height": "48px",
	},
		".scrollback-nick, .scrollback-text": {
			"display": "block", "border": "none",
			"boxSizing": "border-box", "webkitBoxSizing": "border-box",
			"mozBoxSizing": "border-box", "msBoxSizing": "border-box",
			"oBoxSizing": "border-box", padding: "0 4px",
			height: "48px", fontSize: "1em"
		},
		
		".scrollback-nick, .scrollback-text-wrap": {
			"position": "absolute", "top": "0px;",
			"margin": "0"
		},
		".scrollback-nick:focus, .scrollback-text:focus": {
			outline: "none"
		},
		".scrollback-nick": {
			"left": "8px", "width": "80px", color: "#666",
			"background": "#ccc"
		},
		'.scrollback-text-wrap': { "right": "8px", "left": "88px" },
		".scrollback-text": { width: "100%", background: "#fff", color: "#000" },
	".scrollback-poweredby": {
		position: "absolute", bottom: "4px", right: "8px", height: "16px",
		width: "121px", background: "url(poweredby.png)"
	}
};
