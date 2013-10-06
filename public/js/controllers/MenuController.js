angular.module('ARNApp').controller('MenuController', ['$scope', function ($scope) {
  $scope.menu = [{
    "title": "List matches",
    "link": "/match"
  }, {
    "title": "Live (RMCT)",
    "link": "http://live.rmct.tv",
    "target": "_blank"
  }, {
    "title": "Live (CotM)",
    "link": "http://live.championsofthemap.com",
    "target": "_blank"
  }];
}]);