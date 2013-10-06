var config = require('./../../config/config.js');

exports.render = function(req, res) {
  res.render('default',{appName: config.app.name});
};

exports.partials = function(req, res) {
  res.render('partials/' + req.params[0]);
};