var http = require('http');
var loveHateTracker = require('./lovehate');

var tracker = new loveHateTracker(['Obama','Romney']);


http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\n');
}).listen(3000);

console.log('Server running on port 3000');