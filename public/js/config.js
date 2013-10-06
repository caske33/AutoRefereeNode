//Setting up route
window.app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      redirectTo: '/match'
    }).
    when('/match', {
      templateUrl: '/partials/match/index',
      controller: 'MatchController'
    }).
    when('/match/:matchid', {
      templateUrl: '/partials/match/view',
      controller: 'MatchController'
    }).
    otherwise({
      templateUrl: '/partials/404',
      controller: 'MenuController'
    });
  }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix("!");
    $locationProvider.html5Mode(true);
  }
]);