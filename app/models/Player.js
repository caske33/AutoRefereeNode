var Schema = {
  ign : {
    type : "text"
  },
  hp : {
    type: "number",
    defaultValue: 20
  },
  armor : {
    type: "number",
    defaultValue: 0
  },
  hunger : {
    type: "number",
    defaultValue: 20
  },
  kills : {
    type: "number",
    min: 0,
    defaultValue: 0
  },
  deaths : {
    type: "number",
    defaultValue: 0
  },
  accuracy : {
    type: "number",
    defaultValue: 0
  },
  killstreak : {
    type: "number",
    defaultValue: 0
  },
  loggedin : {
    type: "boolean",
    defaultValue: true
  },
  dimension : {
    type: "enum",
    values: ["overworld","nether","end"],
    defaultValue: "overworld"
  }
};

var methods = {};

module.exports = function(db){
  return db.define('Player', Schema, {
    methods: methods
  });
};