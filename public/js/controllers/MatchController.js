angular.module('ARNMatch').controller('MatchController', ['$rootScope','$scope', '$http', '$routeParams', 'MatchModel', function($rootScope, $scope,$http,$routeParams,MatchModel) {

  $scope.init = function(){
    findAll();

    socketJoinRoom("matches");


    $scope.setTitle("All Matches");
  };

  function findAll(cb){
    MatchModel.query(function(matches) {
        $scope.matches = matches;
        if(cb)
          cb();
    });
  }

  $scope.initOne = function(){
    var matchid = $routeParams.matchid;

    findOne(matchid, function(){
      var map = $scope.match.map;
      if(!map)
        $scope.setTitle("Match");
      else
        $scope.setTitle($scope.match.map + " Match");
    });

    socketJoinRoom("match"+matchid);
  };

  function findOne(id, cb){
    MatchModel.get({matchid: id}, function(match) {
        $scope.match = match;
        if(cb)
          cb();
    });
  }

  function socketJoinRoom(room){
    if(!$scope.socket){
      var socket = io.connect();

      socket.on('connect',function(){
        socket.emit('subscribe',{room: room});
      });

      $rootScope.socket = socket;
    }else{
      $scope.socket.emit("subscribe",{room: room});
    }

    $scope.socket.on('update',function(data){
      update_and_apply(data);
    });

    $scope.$on("$destroy", function(){
      $scope.socket.emit('unsubscribe',{room: room});
      $scope.socket.removeAllListeners('update');
    });
  }

  function update_and_apply(data){
    $scope.$apply(function(){
      update(data);
    });
  }

  function update(data){
    if(data.update){
      if(data.team)
        updateTeam(data.team, data.update);
      else if(data.player)
        updatePlayer(data.player, data.update);
      else if(data.match)
        updateMatch(data.update, data.match);
      else
        updateMatch(data.update);
    } else if(data.add){
      if(data.team)
        addTeam(data.add);
      else if(data.player)
        addPlayer(data.teamname, data.add);
      else
        addMatch(data.add);
    } else if(data.remove){
      if(data.team)
        rmTeam(data.team);
      else if(data.player)
        rmPlayer(data.teamname, data.player);
      else
        rmMatch(data.match);
    }
  }

  function updateMatch(update, matchid){
    if(matchid){
      angular.forEach($scope.matches, function(match){
        if(match.id === matchid){
          angular.extend(match, update);
        }
      });
    }else{
      angular.extend($scope.match, update);
    }
  }

  function updateTeam(teamname, update){
    angular.forEach($scope.match.teams, function(team){
      if(team.fullname === teamname)
        angular.extend(team, update);
    });
  }

  function updatePlayer(ign, update){
    angular.forEach($scope.match.teams, function(team){
      angular.forEach(team.players, function(player){
        if(player.ign === ign)
          angular.extend(player, update);
      });
    });
  }

  function addMatch(match){
    $scope.matches.push(match);
  }

  function addTeam(team){
    $scope.match.teams.push(team);
  }

  function addPlayer(teamname, player){
    angular.forEach($scope.match.teams, function(team){
      if(team.name === teamname)
        team.players.push(player);
    });
  }

  function rmMatch(worldname){
    angular.forEach($scope.matches, function(match, index){
      if(match.world === worldname)
        $scope.matches.splice(index, 1);
    });
  }

  function rmTeam(teamname){
    angular.forEach($scope.match.teams, function(team, index){
      if(team.name === teamname)
        $scope.match.teams.splice(index, 1);
    });
  }

  function rmPlayer(teamname, ign){
    angular.forEach($scope.match.teams, function(team){
      if(team.name === teamname)
        angular.forEach(team.players, function(player, index){
          if(player.ign === ign)
            team.players.splice(index, 1);
        });
    });
  }
}]);