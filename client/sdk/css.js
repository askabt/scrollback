var maxWidth = 400, maxHeight = 400, maxGap = 20, margin = 40;
var themes = {};

var css = {
	".scrollback-hidden": { position: "absolute", visibility: "hidden" },

	".scrollback-stream": {
		"position": "fixed",
		"width": "480px", "height": "480px", "bottom": "0px",
		"boxShadow": "0px 0px 8px 2px rgba(0,0,0,0.5)",
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
			position: "absolute", top: "0",
			width: "48px", height: "48px",
			cursor: "pointer", zIndex: 1,
			fontWeight: "bold", lineHeight: "48px", textAlign: "center"
		},
		".scrollback-close": {right: 0},
		".scrollback-hide": {right: "48px"},
		".scrollback-title": {
			"height": "48px",
			lineHeight: "48px", paddingLeft: "10px",
			left: "0px", right: "0px", position: "absolute",
			fontWeight: "bold",
			zIndex: 9997,
			top: "0"
		},
			".scrollback-title-text":{
				fontWeight: "normal", color: "#999"
			},
			".scrollback-toolbar": {
				background: "#eee", height: "40px", top: "40px",
				display:"none"
			},
			".scrollback-toolbtn": {
				float: "left", height: "40px", lineHeight: "40px",
				width: "40px", cursor: "pointer", textAlign: "center",
				borderRadius: "0"
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
				"borderLeft": "4px solid #eee", opacity: 1, height: "auto"
			},
			".scrollback-message-hidden": {
				"opacity": 0,
				"transition": "all 2s ease-out",
				"webkitTransition": "all 2s ease-out", "mozTransition": "all 2s ease-out",
				"oTransition": "all 2s ease-out", "msTransition": "all 2s ease-out",
			},
			".scrollback-message-nick": { "color": "#999" },
			".scrollback-message-separator": { "color": "#666", },
			".scrollback-message-join, .scrollback-message-part": { "color": "#666", },
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
			height: "48px", fontSize: "1em", "borderRadius": "0"
		},

		".scrollback-nick, .scrollback-text-wrap": {
			"position": "absolute", "top": "0",
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
		width: "121px", background: "url(http://scrollback.io/poweredby.png)"
	}
};

themes.light = {
	".scrollback-stream": {
		"background": "#eee", color: "#000",
	},
		".scrollback-close, .scrollback-hide": {
			color: "#000", background: "#eee"
		},
		".scrollback-close:hover, .scrollback-hide:hover": {
			background: "#fff"
		},
		".scrollback-title, .scrollback-toolbar": {
			background: "#eee", color: "#000"
		},
			".scrollback-title-text":{
				color: "#666"
			},
		".scrollback-log": {
			color: "#000"
		},
			".scrollback-message-nick": { "color": "#666" },
			".scrollback-message-separator": { "color": "#999", },
			".scrollback-message-join, .scrollback-message-part": { "color": "#666", },
	".scrollback-timeline": {
		background: "#eee",
	},
		".scrollback-thumb": {
			background: "#999"
		},
		".scrollback-nick, .scrollback-text": {
			"border": "1px solid #ccc",
		},
		".scrollback-nick": {
			color: "#666", "background": "#ccc"
		},
		".scrollback-text": { background: "#fff", color: "#000" },
	".scrollback-poweredby": {
		background: "url(http://scrollback.io/poweredby.png)"
	}
};

themes.dark = {
	".scrollback-stream": {
		"background": "#333", color: "#fff",
	},
		".scrollback-close, .scrollback-hide": {
			color: "#fff", background: "#333"
		},
		".scrollback-close:hover, .scrollback-hide:hover": {
			background: "#000"
		},
		".scrollback-title, .scrollback-toolbar": {
			background: "#333", color: "#fff"
		},
			".scrollback-title-text":{
				color: "#999"
			},
		".scrollback-log": {
			color: "#fff"
		},
			".scrollback-message-nick": { "color": "#999" },
			".scrollback-message-separator": { "color": "#666", },
			".scrollback-message-join, .scrollback-message-part": { "color": "#999", },
	".scrollback-timeline": {
		background: "#333",
	},
		".scrollback-thumb": {
			background: "#000"
		},
		".scrollback-nick": {
			color: "#666", "background": "#ccc"
		},
		".scrollback-text": { background: "#fff", color: "#000" },
	".scrollback-poweredby": {
		background: "url(http://scrollback.io/poweredby.png)"
	}
}