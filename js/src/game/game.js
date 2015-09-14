define([
  'underscore',
  'src/game/unit',
  'src/game/player',
], function(_, Unit, Player) {
  
  var Game = function Game() {
    this.units = [];
    this.players = [new Player(1)];
  };

  Game.prototype.addUnit = function(pid, x, y) {
    var u = new Unit(pid, x, y);
    this.units.push(u);
    this.players[pid - 1].units.push(u);
  };

  Game.prototype.tick = function() {
    this.units.forEach(function(unit) {
      unit.moveToDest();
    });
  };

  return Game;

});
