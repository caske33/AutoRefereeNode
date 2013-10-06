/*var ObjectiveSchema = new Schema({
  block: String,
  status: {
    type: String,
    enum: ["none","found","carry","vm"]
  }
});*/

var colornames = ["black","darkBlue","darkGreen","darkAqua","darkRed","darkPurple","gold","gray","darkGray","blue","green","aqua","red","purple","yellow","white"];

var Schema = {
  color : {
    type : "enum",
    values: colornames
  },
  name : {
    type: "text"
  },
  fullname : {
    type: "text"
  }
};

var methods = {};

module.exports = function(db){
  var Team = db.define('Team', Schema, {
    methods: methods
  });

  Team.getColor = function(colorString, cb){
    if(colorString.charAt(0) === "§" && colorString.length === 2)
      return colornames[parseInt(colorString.charAt(1),16)];
    else
      return null;
    cb();
  };

  return Team;
};
