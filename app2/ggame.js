 Unit = require('./uunit.js');
var Planet = require('./pplanet.js');

var Game = function Game() {
  this.units = [];
  this.players = [];
  this.planets = [];
  this.tick = 0;
  this.uuid = 1;
}

Game.prototype.init = function(players, planets)
  for (var i = 1; i <= players; i++) {
    this.players.push(new Player(i));
  }
  for (var i = 0; i < planets.length; i++) {
    var p = planets[i];
    this.planets.push(new Planet(p.x, p.y, p.maxSize, p.size, p.pid));
  }
};

Game.prototype.addUnit = function(planet) {
  if (this.uuid === Number.MAX_SAFE_INTEGER) {
    uuid = 1;
  }
  var u = new Unit(this.uuid++, planet.pid, planet.x, planet.y);
  this.units.push(u);
  planet.units.push(u);
};

Game.prototype.rmDead = function() {
  this.units = this.units.filter(function(unit) {
    return unit.dead === false;
  });
  this.planets.forEach(function(p) {
    p.units = p.units.filter(function(unit) {
      return unit.dead === false;
    });
  });
};

Game.prototype.detEnd = function(clock) {
  if (this.planets.filter(function(p) { return p.owner === 1; }).length === 0) {
    this.end(clock, false);
  }
  if (this.planets.filter(function(p) { return p.owner !== null && p.owner !== 1; }).length === 0) {
    this.end(clock, true);
  }
};

Game.prototype.doTick = function() {
  var _this = this;
  this.tick += 1;
  this.removeDead();

  // add units
  if (this.tick % 40 === 0) {
    this.planets.forEach(function(p) {
      if (p.pid) _this.addUnit(p);
    });
  }

  // move units
  this.units.forEach(function(unit) {
    unit.act();
  });
};

Game.prototype.moveUnit = function(u) {


