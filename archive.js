var db = require('mysql').createConnection({
		host     : 'localhost',
		user     : 'askabt',
		password : 'askabt',
		database : 'askabt'
	});
	
exports.add = function(message) {
	db.query("INSERT INTO irc SET ?", [message]);
};

exports.get = function(options, callback) {
	var query = "SELECT * FROM `irc` ", where = [], params=[], order=[];
	
	if(options.until) {
		where.push("`time` < ?");
		order.push("`time` DESC");
		params.push(options.until);
	}
	
	if(options.since) {
		where.push("`time` > ?");
		order.push("`time` ASC");
		params.push(options.since);
	}
	
	if(options.to) {
		where.push("`to` = ?");
		params.push(options.to);
	}
	
	if(options.from) {
		where.push("`from` = ?");
		params.push(options.to);
	}
	
	if(options.type) {
		where.push("`type` = ?");
		params.push(options.type);
	}
	
	if(where.length) query += " WHERE " + where.join(" AND ");
	if(order.length) query += " ORDER BY " + order.join(", ");
	query += " LIMIT 64";
	
	query = "SELECT * FROM (" + query + ") r ORDER BY time ASC";
	
	console.log(query, params);
	db.query(query, params, callback);
}
