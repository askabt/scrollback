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
		},
			id,
			["span", {
				'class': 'scrollback-title-text',
				onclick: function() { self.show(); }
			}],
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
		else if(el.className == 'scrollback-title-text') self.titleText = el;
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
	this.hidebtn.innerHTML = '‾';
};

Stream.prototype.show = function() {
	this.stream.className = this.stream.className.replace(/\sscrollback-stream-hidden/g, '');
	this.titleText.innerHTML='';
	this.hidebtn.innerHTML = '_';
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
}
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
			socket.emit('get', {to: this.id, until: until, type: "text"});
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
	var el, str, bot, hidden, i, j;
	
	function format(text) {
		// do something more interesting next time.
		return text;
	}

	str = Stream.get(message.to);	
	switch(message.type) {
		case 'text':
			message.text = format(message.text);
			el = [
				[ "span", {
					'class': 'scrollback-message-nick'
				}, message.from ],
				[ "span", { 'class': 'scrollback-message-separator'}, ' • '],
				[ "span", { 'class': 'scrollback-message-text'}, message.text ]
			];
			break;
		case 'join':
			// var notice=str.notice.innerHTML;
			// var notices=notice.split(",");
			// if(typeof str.noticeTimeout !=="undefined")
			// 	clearTimeout(str.noticeTimeout);
			// if(notices.length==3){
			// 	notice=notices[1]+","+notices[2];
			// }
			// str.notice.innerHTML=notice+","+message.from+((message.type==="join")?" joined":" left");
			// str.notice.className=str.notice.className.replace(" scrollback-hidden","");

			// str.noticeTimeout=setTimeout(function(){
			// 	console.log("timeout called.");
			// 	str.notice.innerHTML="";
			// 	str.notice.className=str.notice.className+" scrollback-hidden";
			// },1000);
			el = [["span", message.from + ' joined.']];

			// fall through.
		case 'part':
			el = el || [["span", message.from + ' left' + (
				message.text? ' (' + message.text + ')': '.'
			)]];

			setTimeout(function(){
				el.className += ' scrollback-message-hidden';
			}, 1000);

			break;
		default:
			el = [["span", message.text]];
	}
	
	
	
	if(str.stream.className.indexOf('scrollback-stream-hidden') != -1) {
		str.titleText.innerHTML = ' ▸ ' + message.from + ' • ' + message.text;
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

	// rearranges messages estimating time to type them
	var estimatedTime = Math.min(3000 * message.text.length / 5, 5000);
	while(bot && bot.getAttribute('data-time') > message.time - estimatedTime && bot.previousSibling) {
		bot = bot.previousSibling;
	}
	str.log.insertBefore(el, bot && (bot.previousSibling? bot.nextSibling: bot));

	hidden = $$(str.log, "scrollback-message-hidden");
	for(i=0, l=hidden.length; i<l; i++) {
		str.log.removeChild(hidden[i]);
	}
	
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
		socket.emit('get', { to: id, until: new Date().getTime(), type: 'text' });
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

