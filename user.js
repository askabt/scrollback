var users = {}, ghUsers = {}, fbUsers = {},
	request = require("request");

exports.get = function(login) {
	if(login.type == 'github') {
		
	}
}

function authFb(callback) {
	request("https://graph.facebook.com/me?fields=id&access_token=" + data.token,
		function(err,res,body) {
			if(err) {
				result.resolve(defer.reject("Can't reach facebook"));
				return;
			}
			if(body.error || body.id!=data.fbid) {
				result.resolve(defer.reject("Wrong facebook account " + data.remoteId));
				return;
			}
			result.resolve(fetchUser(account.userId));
		}
	);
	return result.promise;
}

function authGh() {
	var url = "https://api.github.com/user?access_token=" + data.token;
	request({uri:url, headers: {"User-Agent":"askabt.com"}},
		function(err,res,body) {
			log("Github token auth took " + (new Date() - start) + "ms");
			body = parse.parseUrlEncoded(body);
			if(err) {
				result.resolve(defer.reject("Can't reach github"));
				return;
			}
			if(body.message) {
				result.resolve(defer.reject("Wrong github account " + body.message));
				return;
			}
			result.resolve(fetchUser(account.userId));
		}
	);
	return result.promise;
}
