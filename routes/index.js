var redis = require('redis');
var cf = require('../cloudfoundry');

var redis_host =  cf.redis?cf.redis.credentials.host:'localhost';
var redis_port = cf.redis?cf.redis.credentials.port:6379;
var redis_password = cf.redis?cf.redis.credentials.password:undefined;

var client = redis.createClient(redis_port, redis_host);
if(cf.runningInTheCloud) {
    client.auth(redis_password);
}

/*
 * GET home page.
 */

exports.index = function(req, res){
    //res.render('index', { title: 'Express' })
    client.keys('*', function(err, keys) {
        var response = '';
        response += 'keys:<br/>';
        var sortFunc = function (a,b) {
            yearA = parseInt(a.split("-")[0], 10);
            yearB = parseInt(b.split("-")[0], 10);

            monthA = parseInt(a.split("-")[1], 10);
            monthB = parseInt(b.split("-")[1], 10);

            dateA = parseInt(a.split("-")[2], 10);
            dateB = parseInt(b.split("-")[2], 10);

            if (yearA - yearB !== 0) {
                return yearA - yearB;
            } else if (monthA - monthB) {
                return monthA - monthB;
            } else {
                return dateA-dateB;
            }
        }

        var reverseSortFunc = function (a,b) {
            return -sortFunc(a,b);
        }

        keys.sort(reverseSortFunc);

        keys.forEach(function(key) {
            response += '<a href="date/'+key+'">'+key+'</a>' + ' [<a href="'+key+'">json data</a>]<br/>';
        });
        res.send(response);
    });
};

exports.regex = function(req, res) {
        c = require('../count.js');
        c.count(req.params.expr, req.params.field, function(count) {
                res.send(req.params.field + ' for ' + req.params.expr + ':\n' + count);
        });
};

exports.date = function(req, res) {
    client.hgetall(req.params.date, function(err, response) {
        res.send(JSON.stringify(response));
    });
};

exports.test = function (req, res) {
    res.render('date/index', { date: req.params.date, layout:false })    
}
