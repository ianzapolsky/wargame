define([
  'underscore',
  'src/game/unit',
  'src/game/player',
], function(_, Unit, Player) {
  
  var Game = function Game() {
    this.units = [];
    this.players = [new Player(1), new Player(2)];
  };

  Game.prototype.addUnit = function(pid, x, y) {
    var u = new Unit(this, pid, x, y);
    this.units.push(u);
    this.players[pid - 1].units.push(u);
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
