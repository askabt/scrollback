var socket = io.connect(location.protocol + "//aravind.askabt.com:7777"),
	streams = {}, nick = null;

$(document).ready(function() {
	var text = $("#text"), currentStream, server, channel;
	
	function appendMessage(message) {
		var el, str, bot;
		console.log('received message', message);
		switch(message.type) {
			case 'text':
				el = [
					$("<span>").addClass('nick').text(message.from),
					$("<span>").addClass('separator').text(': '),
					$("<span>").text(message.text)
				];
				break;
			case 'join':
				el = $("<span>").text(message.from + ' joined.');
				break;
			case 'part':
				el = $("<span>").text(message.from + ' left' + (
					message.text? ' (' + message.text + ')': '.'
				));
				break;
			default:
				el = $("<span>").text(message.text);
		}
		
		el = $("<div>").addClass('message hidden').addClass(message.type).append(el);
		str = getStream(message.to);
		bot = (str.scrollTop() + str.height() - str[0].scrollHeight > -20);
		console.log("SCROLL", str.scrollTop() , str.height() , str[0].scrollHeight , bot)
		str.append(el);
		if(bot) str.scrollTop(str[0].scrollHeight+str.height());
		el.removeClass('hidden');
	};
	
	function getStream(id) {
		var holder;
		id = id.toLowerCase();
		console.log("Adding a stream " + id);
		if(streams[id]) {
			return streams[id];
		} else {
			holder = $("<div>").addClass("stream").appendTo($("#streams"));
			$("<div>").addClass("title").appendTo(holder);
			$("<div>").addClass("toolbar").appendTo(holder);
			streams[id] = $("<div>").addClass("log").data('id', id).appendTo(holder);
			$("<div>").addClass("toolbar").appendTo(holder);
			positionStreams();
			return streams[id];
		}
	};
	
	socket.on('message', function(message) {
		if(message.type == 'join' && message.from == nick) {
			message.type = 'connection';
			message.text = 'Connected to ' + message.to + '.';
			console.log('requesting logs' + message.to);
			socket.emit('get', {to: message.to, until: message.time});
		} else {
			appendMessage(message);
		}
	});
	
	socket.on('error', function(message) {
		alert(message);
	})
	
	socket.on('nick', function(n) {
		console.log("Nick updated to " + n);
		nick = n;
	})
	
	$("#send").submit(function(event) {
		event.preventDefault();
		var message = {
			from: nick,
			to: currentStream,
			text: text.val(),
			type: 'text'
		};
		socket.emit('message', message);
		text.val('');
		appendMessage(message);
		return false;
	});
	
	$("#add").submit(function(event) {
		event.preventDefault();
		id = $("#streamId").val();
		stream = getStream(id); selectStream.apply(stream.parent());
		currentStream = id;
		appendMessage({ type: 'connection', text: 'Connecting to ' + id + '...', to: id });
		
		socket.emit('join', id);
		$(this).addClass("hidden");
		return false;
	});
	
	$("#add").click(function() { $(this).removeClass("hidden"); });
	
	$(document).on('click', '.stream', selectStream);
	$(window).resize(positionStreams);
	
	function selectStream() {
		$('.stream').removeClass('selected');
		currentStream = $(this).addClass('selected').data('id');
		positionStreams();
	}
	
	function positionStreams() {
		console.log("Repositioning");
		var columns = $(".stream"), i, l=columns.size(),
			descending = false, z=0, scrw=$("#streams").width(),
			colw = Math.min(scrw, 400), margin=Math.min((scrw-colw)/2, 40),
			pitch = (scrw - colw - 2*margin)/l, col;
		
		for(i=0; i<l; i++) {
			col = columns.eq(i).css({ right: margin + i*pitch, width: colw, zIndex: z + l });
			if(col.data('id') == currentStream) {
				$("#text").css({right: margin + i*pitch, width: colw });
				descending = true;
			};
			z = z + (descending? -1: 1);
		}
	}
	
	$("#signin").click(function() {
		navigator.id.request();
	});
	
	$("#logout").click(function() {
		navigator.id.request();
	});
	
});

