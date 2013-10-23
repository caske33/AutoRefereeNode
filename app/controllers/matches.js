/**
 * Module dependencies.
 */
var async = require('async');

var match_ids = {};

exports.api_index = function(req, res){
  if(req.query.matchid)
    return exports.api_get(req,res);

  req.models.Match.find({},{cache: false},function(error, matches) {
    res.jsonp(matches);
  });
};

exports.api_get = function(req, res){
  var id = req.param('matchid');
  req.models.Match.get(id,{cache: false, autoFetchLimit: 2, autoFetch: true},function(error, match) {
    if(error)
      res.jsonp({err: 404, msg: "Couldn't find match", fullerror: error});
    else
      match.getTeams(function(error, teams){
        match.teams = teams;
        async.forEach(teams, function(team,cb){
          team.getPlayers(function(error, players){
            team.players = players;
            cb(null);
          });
        }, function(){
          res.jsonp(match);
        });
      });
      //res.jsonp(match);
  });
};

exports.api_update = function(req, res){
  var world = req.param('world');
  var message = req.param('msg');
  req.world = world;

  if(message === 'match|'+world+'|init'){
    update_match(message, req, res)(null);
  }
  else{
    get_match_and_update(world, req, res, update_match(message, req, res));
  }
};

function get_match_and_update(world, req, res, cb){
  if(match_ids[world])
    return cb(match_ids[world]);

  req.models.Match.find({world: world}).first(function(error, match) {
    if(error || match === null)
      return res.jsonp({error: error || "404 Match Not Found!", message: "Could not find the match! Check the world name."});

    match_ids[world] = match.id;
    return cb(match.id);
  });
}

function update_match(message, req, res){
  return function(matchid){
    var parts = message.split("|");
    switch(parts[0].toLowerCase()){
      case "player":
        var player_update = {};
        var ign = parts[1];
        switch(parts[2].toLowerCase()){
          case "hp":
            player_update.hp = parseInt(parts[3],10);
            update_player_object(matchid, ign, player_update, req, res);
            break;
          case "armor":
            player_update.armor = parseInt(parts[3],10);
            update_player_object(matchid, ign, player_update, req, res);
            break;
          case "hunger":
            player_update.hunger = parseInt(parts[3],10);
            update_player_object(matchid, ign, player_update, req, res);
            break;
          /*case "goal":
            break;*/
          case "kills":
            player_update.kills = parseInt(parts[3],10);
            update_player_object(matchid, ign, player_update, req, res);
            break;
          /*case "deathpos":
            break;*/
          case "deaths":
            player_update.deaths = parseInt(parts[3],10);
            update_player_object(matchid, ign, player_update, req, res);
            break;
          /*case "dominate":
            break;
          case "revenge":
            break;*/
          case "accuracy":
            player_update.accuracy = parseInt(parts[3],10);
            update_player_object(matchid, ign, player_update, req, res);
            break;
          case "streak":
            player_update.killstreak = parseInt(parts[3],10);
            update_player_object(matchid, ign, player_update, req, res);
            break;
          case "login":
            player_update.loggedin = true;
            update_player_object(matchid, ign, player_update, req, res);
            break;
          case "logout":
            player_update.loggedin = false;
            update_player_object(matchid, ign, player_update, req, res);
            break;
          case "dimension":
            player_update.dimension = parts[3];
            update_player_object(matchid, ign, player_update, req, res);
            break;
          default:
            jsonp_command_not_found(res, message);
        }
        break;
      case "team":
        var team_update = {};
        var teamname = parts[1];
        switch(parts[2].toLowerCase()){
          case "init":
            req.models.Team.find({match_id: matchid,name: teamname}).remove(function(err){
              if(err)
                return res.jsonp(err);

              req.socketio.sockets.in('match'+matchid).emit('update',{team: teamname, remove: teamname});

              req.models.Team.create({match_id: matchid,name: teamname, fullname: teamname}, function(err, team){
                if (err)
                  return res.jsonp(err);
                else{
                  req.socketio.sockets.in('match'+matchid).emit('update',{team: teamname, add: team});
                  res.jsonp(team);
                }
              });
            });
            break;
          case "destroy":
            var name = parts[1];
            req.models.Team.find({match_id: matchid, name: name}).remove(function(err){
              if(err)
                return res.jsonp(err);
              else{
                req.socketio.sockets.in('match'+matchid).emit('update',{team: teamname, remove: teamname});
                return res.jsonp({msg: "team destroyed."});
              }
            });
            break;
          case "name":
            team_update.fullname = parts[3];
            update_team_object(matchid, teamname, team_update, req, res);
            break;
          case "color":
            var colorstring = parts[3];
            team_update.color = req.models.Team.getColor(colorstring);
            update_team_object(matchid, teamname, team_update, req, res);
            break;
          case "player":
            var addPlayer = (parts[3].charAt(0) === '+');
            ign = parts[3].substring(1);
            req.models.Team.find({match_id: matchid, name: teamname}).first(function(err, team){
              if(err)
                return res.jsonp(err);

              req.models.Player.find({team_id: team.id,ign: ign}).remove(function(err){
                if(err)
                  return res.jsonp(err);

                req.socketio.sockets.in('match'+matchid).emit('update',{player: ign, teamname: teamname, remove: ign});

                if(addPlayer){
                  req.models.Player.create({team_id: team.id,ign: ign}, function(err, player){
                    if (err)
                      return res.jsonp(err);
                    else{
                      req.socketio.sockets.in('match'+matchid).emit('update',{player: ign, teamname: teamname, add: player});
                      res.jsonp(player);
                    }
                  });
                }else{
                  res.jsonp({msg: "Player removed!"});
                }
              });
            });
            break;
          /*case "goal":
            break;
          case "state":
            break;*/
          default:
            jsonp_command_not_found(res, message);
        }
        break;
      case "match":
        var match_update = {};
        switch(parts[2].toLowerCase()){
          case "init":
            var world = req.world;
            req.models.Match.find({world: world}).remove(function(err){
              if(err)
                return res.jsonp(err);

              req.socketio.sockets.in('matches').emit('update',{match: world, remove: world});

              req.models.Match.create({world: world},function(err, match){
                if (err) {
                  return res.jsonp(err);
                }
                else {
                  match_ids[world] = match.id;
                  req.socketio.sockets.in('matches').emit('update',{add: match});
                  return res.jsonp(match);
                }
              });
            });
            break;
          case "destroy":
            world = req.world;
            req.models.Match.find({world: world}).remove(function(err){
              if(err)
                return res.jsonp(err);

              req.socketio.sockets.in('matches').emit('update',{match: world, remove: world});
              res.jsonp({msg: "Match removed!"});
            });
            break;
          case "map":
            match_update.map = parts[3];
            update_match_object(matchid, match_update, req, res);
            break;
          case "time":
            var timestamp = parts[3];
            var timeparts = timestamp.split(",");
            if(timestamp.indexOf(":") !== -1)
              timeparts = timestamp.split(":");
            var hours = parseInt(timeparts[0],10),
              minutes = parseInt(timeparts[1],10),
              seconds = parseInt(timeparts[2],10);
            var startTime = new Date();
            startTime.setHours(startTime.getHours()-hours);
            startTime.setMinutes(startTime.getMinutes()-minutes);
            startTime.setSeconds(startTime.getSeconds()-seconds);
            match_update.startTime = startTime;
            update_match_object(matchid, match_update, req, res);
            break;
          case "countdown":
            startTime = new Date();
            startTime.setSeconds(startTime.getSeconds()+parts[3]);
            match_update.startTime = startTime;
            update_match_object(matchid, match_update, req, res);
            break;
          case "start":
            match_update.startTime = new Date();
            update_match_object(matchid, match_update, req, res);
            break;
          case "end":
            match_update.endTime = new Date();
            update_match_object(matchid, match_update, req, res);
            /*match.findTeam(parts[3],function(err, team){
              console.log(team)
              match_update.winners = team._id;
              update_match_object(matchid, match_update, req, res);
            });*/
            break;
          default:
            jsonp_command_not_found(res, message);
        }
        break;
      default:
        jsonp_command_not_found(res, message);
    }
  };
}

function jsonp_command_not_found(res, message){
  res.jsonp({err: "command not found", command: message});
}

function update_match_object(matchid, update, req, res){
  req.models.Match.get(matchid, function(err, match){
    match.save(update, function(err){
      if(err)
        res.jsonp(err);
      else
        res.jsonp(update);
    });
  });
  req.socketio.sockets.in('matches').emit('update',{match: matchid, update: update});
  req.socketio.sockets.in('match'+matchid).emit('update',{update: update});
}

function update_team_object(matchid, teamname, update, req, res){
  req.models.Team.find({name: teamname, match_id: matchid}).first(function(err, team){
    team.save(update, function(err){
      if(err)
        res.jsonp(err);
      else
        res.jsonp(update);
    });
  });
  req.socketio.sockets.in('match'+matchid).emit('update',{team: teamname, update: update});
}

function update_player_object(matchid, ign, update, req, res){
  req.models.Team.find({match_id: matchid}).each(function(team){
    req.models.Player.find({ign: ign, team_id: team.id}).first(function(err, player){
      if(player === null)
        return;

      player.save(update, function(err){
        if(err)
          res.jsonp(err);
        else
          res.jsonp(update);
      });
    });
  });
  req.socketio.sockets.in('match'+matchid).emit('update',{player: ign, update: update});
}