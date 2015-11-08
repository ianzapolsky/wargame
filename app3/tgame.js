var Unit = require('./tunit.js').Unit;
var Planet = require('./tplanet.js').Planet;

var Game = function Game() {
  this.units = [];
  this.planets = [];
  this.players = [];
  this.tick = 0;
  this.uid = 0;
};

Game.prototype.init = function() {
  this.planets = [
    new Planet(0, 1, 3, 100, 300),
    new Planet(1, 2, 3, 300, 300),
    new Planet(2, 1, 3, 300, 100)
  ];
};

Game.prototype.doTick = function() {
  var _this = this;
  var newUnits = [];
  this.planets.forEach(function(p) {
    if (p.owner !== null) {
      for (var i = 0; i < p.size; i++) {
        var nu = new Unit(_this.uid++, p.owner, p.id, p.x, p.y);
        _this.units.push(nu);
        newUnits.push(nu);
      }
    }
  });
  return newUnits;
};

exports.Game = Game;
