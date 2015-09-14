define([
  'underscore',
  'src/game/unit',
  'src/game/player',
  'src/game/planet',
], function(_, Unit, Player, Planet) {
  
  var Game = function Game() {
    this.units = [];
    this.players = [new Player(1), new Player(2)];
    this.planets = [];
    this.tick = 0;
  };

  Game.prototype.addUnit = function(pid, x, y, planet) {
    var u = new Unit(this, pid, x, y, planet);
    this.units.push(u);
    this.players[pid - 1].units.push(u);
  };

  Game.prototype.addPlanet = function(x, y, owner) {
    var p = new Planet(this, x, y);
    if (owner) {
      p.owner = owner;
    }
    this.planets.push(p);
  };

  Game.prototype.doTick = function() {
    this.tick += 1;
    if (this.tick % 50 === 0) {
      this.planets.forEach(function(planet) {
        planet.addUnit();
      });
    }
    this.units.forEach(function(unit) {
      unit.act();
    });
    this.removeDead();
  };

  Game.prototype.removeDead = function() {
    this.units = this.units.filter(function(unit) {
      return unit.dead === null;
    });
  };

  return Game;

});
