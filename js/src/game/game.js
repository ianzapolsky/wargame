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
    var u = new Unit(pid, x, y);
    this.units.push(u);
    this.players[pid - 1].units.push(u);
  };

  Game.prototype.tick = function() {
    var _this = this;
    this.units.forEach(function(unit) {
      unit.moveToDest();
      _this.detectDeath(unit);
    });
    this.removeDead();
  };

  Game.prototype.detectDeath = function(unit) {
    if (!unit.isDead) {
      this.units.forEach(function(u) {
        if (u === unit) {
          return;
        } else {
          if (u.pid !== unit.pid &&
            (Math.abs(u.x - unit.x) < 2 && Math.abs(u.y - unit.y) < 2)) {
            unit.isDead = true;
            u.isDead = true;
          }
        }
      });
    }
  };

  Game.prototype.removeDead = function() {
    this.units = this.units.filter(function(unit) {
      return typeof(unit.isDead) === 'undefined';
    });
  };

  return Game;

});
