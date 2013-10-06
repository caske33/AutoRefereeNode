var _ = require('underscore');

var Schema = {
  world : {
    type: "text"
  },
  startTime : {
    type: "date"
  },
  endTime : {
    type: "date"
  },
  map : {
    type: "text"
  }
};

var methods = {};

module.exports = function(db){
  return db.define('Match', Schema, {
    methods: methods
  });
};