/**
 * Module dependencies.
 */
var express = require('express'),
  fs = require('fs'),
  http = require('http');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
  config = require('./config/config');

//Bootstrap db connection
//var db = mongoose.connect(config.db);

//Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function(file) {
  require(models_path + '/' + file);
});

var app = express(),
  server = http.createServer(app);

//socket.io settings
require('./config/socketio')(server,app);

//express settings
require('./config/express')(app);

//Bootstrap routes
require('./config/routes')(app, config);

//Start the app by listening on <port>
var port = config.port;
server.listen(port);
console.log('Express app started on port ' + port);

//expose app
exports = module.exports = app;