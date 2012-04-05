var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');

var services = process.env.VCAP_SERVICES?JSON.parse(process.env.VCAP_SERVICES):{};
console.log(services);



//var redis_host =  services.redis-2.2[0].credentials['hostname'] || 'localhost';
//var redis_port = process.env.VCAP_SERVICES || 
/*{ 'redis-2.2': 
  [ { name: 'redis-69908',
      label: 'redis-2.2',
      plan: 'free',
      tags: [Object],
      credentials: [Object] } ] }*/


var client = redis.createClient();

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