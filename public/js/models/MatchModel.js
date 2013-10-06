//define the resource location
angular.module('ARNMatch').factory('MatchModel', ['$rootScope','$resource', function($rootScope,$resource) {
  return $resource($rootScope.API_PATH+'/match/:matchid', {
    matchid: '@id'
  });
}]);