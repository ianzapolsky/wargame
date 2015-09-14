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
  };

  Game.prototype.addUnit = function(pid, x, y) {
    var u = new Unit(this, pid, x, y);
    this.units.push(u);
    this.players[pid - 1].units.push(u);
  };

  Game.prototype.addPlanet = function(x, y, owner) {
    var p = new Planet(x, y);
    if (owner) {
      p.owner = owner;
    }
    this.planets.push(p);
  };

  Game.prototype.tick = function() {
    var _this = this;
    this.units.forEach(function(unit) {
      unit.detectFight();
      unit.moveToDest();
      unit.detectDeath();
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
