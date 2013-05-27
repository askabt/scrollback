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
		thumbBottom = 0,
		viewTop = offset(log)[1] + log.scrollTop,
		viewBottom = viewTop + log.clientHeight;
	
	while(msg) {
		pos = offset(msg)[1];
		if(pos >= viewTop && pos <= viewBottom){
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
		buckets[i].from = msg.getAttribute('data-from');
		if(buckets[i].n > max) max = buckets[i].n;
		msg = msg.nextSibling;
	}
	
	for(i=0; i<n; i++) {
		if(buckets[i]) {
			r = ["div", {'class': 'scrollback-tread-row', style: {
				top: (i*h) + 'px'
			}}];
			for(color in buckets[i].colors) {
				r.push(["div", {'class': 'scrollback-tread-dot ' + 'scrollback-users-' + buckets[i].from, style: {
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