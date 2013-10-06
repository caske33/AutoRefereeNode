var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    orm = require('orm');

module.exports = function(){
  return function(db, models, next){
    var models_path = __dirname + '';
    fs.readdirSync(models_path).forEach(function(file) {
      models[path.basename(file,path.extname(file))] = require(models_path + '/' + file)(db);
    });

    models.Team.hasOne('match',models.Match,{reverse: "teams"});
    models.Player.hasOne('team',models.Team, {reverse: "players"});

    _.forEach(db.models,function(model){
      model.sync(function(err){
        /*if(err)
          console.log("Syncing database error: %s",err);*/
      });
    });

    next();
  };
};
