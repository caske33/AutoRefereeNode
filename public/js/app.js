var App = window.app = angular.module('ARNApp', ['ARNMatch']);

App.run(['$rootScope', function($rootScope) {
  $rootScope.API_PATH = '/api';
  $rootScope.setTitle = function(newTitle) {
    if(newTitle !== "")
      $rootScope.title = newTitle + " | " + $rootScope.appName;
    else
      $rootScope.title = $rootScope.appName;
  };
}]);

angular.module('ARNMatch',['ngResource']);