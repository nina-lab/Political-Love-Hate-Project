

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var loveHateTracker = require('./lovehate');
var tracker = new loveHateTracker(['Obama','Romney']);

var cf = require('./cloudfoundry');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/getAll', routes.getAll);

app.get('/date/:date', routes.test);

app.get('/count/:field/:expr', routes.regex);

app.get('/:date', routes.date);



app.listen(cf.port || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
