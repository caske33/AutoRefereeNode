module.exports = function(app, config) {

  //API ROUTES
  var api_url = config.api_url;

  //Match API Routes
  var matches = require('../app/controllers/matches');
  app.get(api_url+'/match', matches.api_index);
  app.get(api_url+'/match/:matchid', matches.api_get);
  app.put(api_url+'/match',matches.api_update);


  //Web Aplication Routes - They all use index (the real route will be rendered by the angularjs route system)
  var index = require('../app/controllers/index');
  app.get('/', index.render);
  app.get(/^\/match(?:\/.*)?$/, index.render);


  //Jade templates for the partial views.
  app.get(/^\/partials\/(.*)$/, index.partials);
};
