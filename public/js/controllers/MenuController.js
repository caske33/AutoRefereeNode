angular.module('ARNApp').controller('MenuController', ['$scope', function ($scope) {
  $scope.menu = [{
    "title": "List Matches",
    "link": "/match",
    "icon_class": "glyphicon glyphicon-th"
  }, {
    "title": "Live (RMCT)",
    "link": "http://live.rmct.tv",
    "target": "_blank",
    "icon_class": "icon-play-circle"
  }, {
    "title": "Live (CotM)",
    "link": "http://live.championsofthemap.com",
    "target": "_blank",
    "icon_class": "icon-play-circle"
  }];
}]);