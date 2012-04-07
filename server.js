var http = require('http');
var redis = require('redis');
var cf = require('./cloudfoundry');
var loveHateTracker = require('./lovehate');

var tracker = new loveHateTracker(['Obama','Romney']);

var redis_host =  cf.redis?cf.redis.credentials.host:'localhost';
var redis_port = cf.redis?cf.redis.credentials.port:6379;
var redis_password = cf.redis?cf.redis.credentials.password:undefined;

var client = redis.createClient(redis_port, redis_host);
if(cf.runningInTheCloud) {
    client.auth(redis_password);
}

http.createServer(function (req, res) {
    client.keys('*', function(err, keys) {
	var response = '';
	response += 'keys:<br/>';
	keys.forEach(function(key) {
	    response += key + '<br/>';
	});
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end('Hello World!<br/>'+response);
    });
}).listen(cf.port || 3000);

console.log('Server running on port 3000');