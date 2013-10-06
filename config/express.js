/**
 * Module dependencies.
 */
var express = require('express'),
	  config = require('./config'),
    orm = require('orm'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore');

module.exports = function(app) {
  app.set('showStackError', true);

  //Should be placed before express.static
  app.use(express.compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  //Setting the fav icon and static folder
  app.use(express.favicon('public/img/favicon.png'));
  app.use(express.static(config.root + '/public'));

  //Don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  //Set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  //Enable jsonp
  app.enable("jsonp callback");

  app.configure(function() {
    //cookieParser should be above session
    app.use(express.cookieParser());

    //bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    orm.settings.set("instance.returnAllErrors", true);

    app.use(orm.express(config.db, {
      define: require('../app/models/index')(),
    }));

    //routes should be at the last
    app.use(app.router);

    app.use(function(err, req, res, next) {
      //Log it
      console.error(err.stack);

      //Error page
      res.status(500).render('default', {
        error: err.stack
      });
    });

    //Assume 404 since no middleware responded
    app.use(function(req, res, next) {
      res.status(404).render('default', {
        url: req.originalUrl,
        error: 'Not found'
      });
    });

  });
};
