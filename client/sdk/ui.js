var streams = {}, nick = null,
	$ = function(id) {
		return document.getElementById(id);
	}, $$ = getByClass;

window.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		function(cb) { setTimeout(cb, 25); };

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
		onmousedown: function() { self.select(); }
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
		["div", {'class': 'scrollback-timeline'},
			["div", {'class': 'scrollback-tread'}],
			["div", {'class': 'scrollback-thumb'}]
		],
		["div", {'class': 'scrollback-log', onscroll: function() { self.scroll(); }}],
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
				onfocus: function() { this.select(); },
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
		else if(el.className == 'scrollback-tread') self.tread = el;
		else if(el.className == 'scrollback-thumb') self.thumb = el;
		else if(el.className == 'scrollback-title') self.title = el;
		return el;
	});
	
	self.connected = false;
	document.body.appendChild(self.stream);
};

Stream.prototype.close = function (){
	delete streams[this.id];
	socket.emit('part', this.id);
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
		time: new Date().getTime()
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
};

Stream.prototype.ready = function() {
	this.nick.disabled = false;
	this.text.disabled = false;
	this.text.value = '';
	console.log(this.id + "  is ready");
};

Stream.prototype.scroll = function() {
	var log = this.log, up, until = this.firstMessageAt;
	
	if(typeof this.lastScrollTop !== 'undefined' && until > 0 &&
		until != this.lastRequestedUntil
	) {
		up = log.scrollTop < this.lastScrollTop;
		if(log.scrollTop < log.clientHeight && up) {
			this.lastRequestedUntil = until;
			socket.emit('get', {to: this.id, until: until});
		}
	}
	
	this.renderThumb();
	
	if(log.scrollHeight - (log.scrollTop + log.clientHeight) < 16)
		this.scrolledUp = false;
	else
		this.scrolledUp = true;

	this.lastScrollTop = log.scrollTop;
};

Stream.prototype.renderThumb = function() {
	var log = this.log, msg = log.lastChild, pos,
		thumbTop = this.tread.clientHeight,
		thumbBottom = 0;
	
	while(msg) {
		pos = offset(msg)[1];
		if(pos > log.scrollTop &&
			pos < log.scrollTop + log.clientHeight
		) {
			pos = msg.getAttribute('data-time');
			pos = (pos - this.firstMessageAt) * this.tread.clientHeight /
				(this.lastMessageAt - this.firstMessageAt);
			if(pos < thumbTop) thumbTop = pos;
			if(pos > thumbBottom) thumbBottom = pos;
		}
		msg = msg.previousSibling;
	}
	
	this.thumb.style.top = thumbTop + 'px';
	this.thumb.style.height = (thumbBottom - thumbTop +1) + 'px';
};

Stream.prototype.renderTimeline = function() {
	var buckets = [], n=128, h=this.tread.clientHeight/n, i,
		first = this.firstMessageAt, duration=this.lastMessageAt-first,
		msg = this.log.firstChild, color, r, ml = ["div"], max=0, frac;
	
	this.tread.innerHTML = '';
	
	while(msg) {
		i = Math.floor((msg.getAttribute('data-time') - first)*n / duration);
		if(!buckets[i]) buckets[i] = {colors: [], n: 0}
		color = msg.style.borderLeftColor; // Yuck.
		buckets[i].colors[color] = (buckets[i].colors[color] || 0) + 1;
		buckets[i].n += 1;
		if(buckets[i].n > max) max = buckets[i].n;
		msg = msg.nextSibling;
	}
	
	for(i=0; i<n; i++) {
		if(buckets[i]) {
			r = ["div", {'class': 'scrollback-tread-row', style: {
				top: (i*h) + 'px'
			}}];
			for(color in buckets[i].colors) {
				r.push(["div", {'class': 'scrollback-tread-dot', style: {
					background: color, height: h + 'px',
					width: (buckets[i].colors[color]*18/max) + 'px'
				}}]);
			}
			ml.push(r);
		}
	}
	
	this.tread.appendChild(JsonML.parse(ml));
	
	this.renderThumb();
};

// ---- Static methods ----

Stream.message = function(message) {
	var el, str, bot;
	
	console.log('message', message);
	
	function format(text) {
		// do something more interesting next time.
		return text;
	}
	
	switch(message.type) {
		case 'text':
			message.text = format(message.text);
			el = [
				[ "span", {
					'class': 'scrollback-message-nick'
				}, message.from ],
				[ "span", { 'class': 'scrollback-message-separator'}, ': '],
				[ "span", { 'class': 'scrollback-message-text'}, message.text ]
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
	
	str = Stream.get(message.to);
	
	if(str.stream.className.indexOf('scrollback-stream-hidden') != -1) {
		console.log('message received while minimized');
		str.title.innerHTML = str.id + '>' + message.from + '>' + message.text;
	}

	if(typeof str.firstMessageAt == 'undefined' ||
		message.time < str.firstMessageAt) str.firstMessageAt = message.time;
	
	if(!message.time) console.log("Hit zero at ", message);
	
	if(typeof str.lastMessageAt == 'undefined' ||
		message.time > str.lastMessageAt) str.lastMessageAt = message.time;
	
	if(!el) return;
	
	el = JsonML.parse(["div", {
		'class': 'scrollback-message scrollback-message-' + message.type,
		'style': { 'borderLeftColor': hashColor(message.from) },
		'data-time': message.time
	}].concat(el));
	bot = str.log.lastChild;
	while(bot && bot.getAttribute('data-time') > message.time && bot.previousSibling) {
		bot = bot.previousSibling;
	}
	str.log.insertBefore(el, bot && (bot.previousSibling? bot.nextSibling: bot));
	
	if(!str.scrolledUp) {
		str.log.scrollTop = str.log.scrollHeight;
	} else {
		str.log.scrollTop += el.clientHeight;
	}
	
	if(str.scrollTimer) clearTimeout(str.scrollTimer);
	str.scrollTimer = setTimeout(function() {
		str.renderTimeline();
	}, 200);
};

Stream.get = function(id) {
	var holder;
	id = id.toLowerCase();
	if(streams[id]) {
		return streams[id];
	} else {
		streams[id] = new Stream(id);
		Stream.position();
		streams[id].lastRequestedUntil = new Date().getTime();
		socket.emit('get', { to: id, until: new Date().getTime() });
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
};

Stream.position = function() {
	var ss = $$(document, "scrollback-stream"), i, l=ss.length,
		step = 1, z=0,
		scrw = window.innerWidth || document.documentElement.clientWidth ||
			document.getElementsByTagName('body')[0].clientWidth,
		scrh = window.innerHeight || document.documentElement.clientHeight ||
			document.getElementsByTagName('body')[0].clientHeight,		
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
};

// --- color for names ---

function hashColor(name) {
	function hash(s) {
		var h=1, i, l;
		for (i=0, l=s.length; i<l; i++) {
			h = (Math.abs(h<<(7+i))+s.charCodeAt(i))%1530;
		}
		return h;
	}
	
	function color(h) {
		// h must be between [0, 1529] inclusive
		
		function hex(n) {
			var h = n.toString(16);
			h = h.length==1? "0"+h: h;
			return h;
		}
		
		function rgb(r, g, b) {
			return "#" + hex(r) + hex(g) + hex(b);
		}
		
		if(h<255) return rgb(255, h, 0);
		else if(h<510) return rgb(255-(h-255), 255, 0);
		else if(h<765) return rgb(0, 255, h-510);
		else if(h<1020) return rgb(0, 255-(h-765), 255);
		else if(h<1275) return rgb(h-1020, 0, 255);
		else return rgb(255, 0, 255-(h-1275));
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
		"boxShadow": "0px 0px 8px 2px rgba(0,0,0,1)",
		"boxSizing": "border-box", "webkitBoxSizing": "border-box",
		"mozBoxSizing": "border-box", "msBoxSizing": "border-box",
		"oBoxSizing": "border-box",
		"fontSize": "13px", lineHeight: "14px",
		"transition": "all 0.2s ease-out",
		"webkitTransition": "all 0.2s ease-out", "mozTransition": "all 0.2s ease-out",
		"oTransition": "all 0.2s ease-out", "msTransition": "all 0.2s ease-out",
		"overflow": "hidden"
	},
	".scrollback-stream-hidden": {
		"height": "40px !important"
	},
		".scrollback-stream-hidden .scrollback-hide": { display: "none" },
		".scrollback-close, .scrollback-hide": {
			float: "right", width: "48px", fontWeight: "bold",
			height: "48px", cursor: "pointer", lineHeight: "48px",
			textAlign: "center", color: "#fff"
		},
		".scrollback-close:hover, .scrollback-hide:hover": {
			background: "#000"
		},
		".scrollback-title, .scrollback-toolbar": {
			"height": "48px", background: "#333",
			lineHeight: "48px", paddingLeft: "10px",
			left: "0px", right: "0px", position: "absolute",
			fontWeight: "bold"
		},
			".scrollback-title": {
				color: "#fff", zIndex: 9997,
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
			"boxSizing": "border-box", "webkitBoxSizing": "border-box",
			"mozBoxSizing": "border-box", "msBoxSizing": "border-box",
			"oBoxSizing": "border-box",
			"position": "absolute", "top": "48px",
			"bottom": "80px", "left": "0", "right": "0",
			"overflowY": "auto", "overflowX": "hidden",
			color: "#fff"
		},
			".scrollback-message": {
				"overflow": "hidden", padding: "2px 24px 2px 48px",
				"transition": "all 0.2s ease-out", textIndent: "-32px",
				"webkitTransition": "all 0.2s ease-out", "mozTransition": "all 0.2s ease-out",
				"oTransition": "all 0.2s ease-out", "msTransition": "all 0.2s ease-out",
				"borderLeft": "4px solid #eee"
			},
			".scrollback-message-nick": { "color": "#ccc" },
			".scrollback-message-start": { "height": "0px", },
			".scrollback-message-join, .scrollback-message-part": { "color": "#999", },
	".scrollback-timeline": {
		background: "#333", position: "absolute", top: "48px", right: "0", width: "18px",
		bottom: "80px", zIndex: 9996
	},
		".scrollback-tread": {
			position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
			zIndex: 1
		},
			".scrollback-tread-row": { position: "absolute", height: "4px", width: "100%" },
			".scrollback-tread-dot": { 'float': "right", height: '4px', borderRadius: "0"},
		".scrollback-thumb": {
			background: "#000", position: "absolute", left: "0px",
			width: "18px", zIndex: 0
		},
	".scrollback-send": {
		"position": "absolute", "padding": "0", "margin": "0",
		"bottom": "24px", "left": "8px", "right": "8px", "height": "48px",
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
		position: "absolute", bottom: "4px", right: "16px", height: "16px",
		width: "121px", background: "url(poweredby.png)"
	}
};
