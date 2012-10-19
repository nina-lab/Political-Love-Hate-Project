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
	;
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
	response.ObamaTotal = parseInt(response.ObamaLove) + parseInt(response.ObamaHate, 10);
	response.RomneyTotal = parseInt(response.RomneyLove) + parseInt(response.RomneyHate, 10);
	response.ObamaHatePercentage = parseInt(response.ObamaHate, 10)/response.ObamaTotal*100;
	response.ObamaLovePercentage = parseInt(response.ObamaLove, 10)/response.ObamaTotal*100;
	response.RomneyHatePercentage = parseInt(response.RomneyHate, 10)/response.RomneyTotal*100;
	response.RomneyLovePercentage = parseInt(response.RomneyLove, 10)/response.RomneyTotal*100;
	response.ObamaHatePercentage = Math.round(response.ObamaHatePercentage*100)/100;
	response.ObamaLovePercentage = Math.round(response.ObamaLovePercentage*100)/100;
	response.RomneyHatePercentage = Math.round(response.RomneyHatePercentage*100)/100;
	response.RomneyLovePercentage = Math.round(response.RomneyLovePercentage*100)/100;
	response.ObamaChartURL = "https://chart.googleapis.com/chart?cht=p&chd=t:"+response.ObamaLovePercentage+","+response.ObamaHatePercentage+"&chs=250x100&chl=Love("+response.ObamaLovePercentage+"%)|Hate("+response.ObamaHatePercentage+"%)&chco=5555FF|AAAAFF";
	response.RomneyChartURL = "https://chart.googleapis.com/chart?cht=p&chd=t:"+response.RomneyLovePercentage+","+response.RomneyHatePercentage+"&chs=250x100&chl=Love("+response.RomneyLovePercentage+"%)|Hate("+response.RomneyHatePercentage+"%)&chco=FF5555|FFAAAA";
        res.send(JSON.stringify(response));
    });
};

exports.test = function (req, res) {
    res.render('date/index', { date: req.params.date, layout:false })    
}

exports.getAll = function (req, res) {
    client.keys("*", function (err, keys) {
	console.log(keys);
	var results = [];
	
	var recursiveGet = function(results, keys) {
	    if(keys.length > 0) {
		client.hgetall(keys[0], function (err, value) {
		    var key = keys[0],
		        obj = {};
		    //modify value with calculation
		    obj[key] = value;

		    results.push(obj);
		    keys.shift();
		    recursiveGet(results, keys);
		});
	    } else {
		res.send(JSON.stringify(results));
	    }
	}
	recursiveGet(results, keys);
    });
}
