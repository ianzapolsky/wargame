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
    new Planet(1, 1, 3, 100, 300),
    new Planet(2, 2, 3, 300, 100)
  ];
};

Game.prototype.addUnits = function() {
  for (var i = 0; i < this.planets.length; i++) {
    var planet = this.planets[i];
    if (planet.owner !== null) {
      for (var j = 0; j < planet.size; j++) {
        var newUnit = new Unit(this.uid++, planet.owner, planet.x, planet.y);
        newUnit.planet = planet;
        this.units.push(newUnit);
      }
    }
  }
};

Game.prototype.doTick = function() {
  this.tick += 1;

  if (this.tick % 40 === 0) {
    for (var i = 0; i < this.planets.size; i++) {
      var planet = this.planets[i];
      if (planet.owner !== null) {
        var newUnit = new Unit(uid++, planet.owner, planet.x, planet.y);
        newUnit.planet = planet;
        _this.units.push(newUnit);
      }
    }
  }
};

exports.Game = Game;

