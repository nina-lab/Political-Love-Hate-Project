var twitter = require('ntwitter');
var redis = require('redis');
var cf = require('./cloudfoundry');
var credentials = require('./credentials.js');

var redis_host =  cf.redis?cf.redis.credentials.host:'localhost';
var redis_port = cf.redis?cf.redis.credentials.port:6379;
var redis_password = cf.redis?cf.redis.credentials.password:undefined;

console.log(redis_host);
console.log(redis_port);
console.log(redis_password);

var client = redis.createClient(redis_port, redis_host);
if(cf.runningInTheCloud) {
    client.auth(redis_password);
}

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

function LoveHateTracker(names) {
    t.stream(
	'statuses/filter',
	{ track: names },
	function(stream) {
            stream.on('data', function(tweet) {
		var d = (tweet.created_at);
		var month = new Date(Date.parse(d)).getMonth()+1;
		var day = new Date(Date.parse(d)).getDate();
		var year = new Date(Date.parse(d)).getFullYear();
		var date = (year + "-" + month + "-" + day);

		if(tweet.text.match(/love/i)) {
		    console.log(tweet.text);
		}

		names.forEach(function(name) {
		    if(tweet.text.match(name)) {
			if(tweet.text.match(/(\s|^)love(\s|$)/i)) {
			    client.hincrby(date, name+'Love','1', redis.print);
			}
            
			if(tweet.text.match(/(\s|^)hate(\s|$)/i)) {
			    client.hincrby(date, name+'Hate', '1', redis.print);
			}
		    }
		});
            });
	}
    )
}

module.exports = LoveHateTracker;