define([
  'underscore',
  'src/game/game',
], function(_, Game) {

  var Player = function Player(game, pid) {
    this.game = game;
    this.pid = pid;
    this.selected = [];
    this.units = [];
  };

  Player.prototype.flagSelected = function(x1, y1, x2, y2) {
    var _this = this;
    this.selected = [];
    this.units.forEach(function(unit) {
      unit.selected = false;
      if (unit.isWithin(x1, y1, x2, y2)) {
        unit.selected = true;
        _this.selected.push(unit);
      }
    });
  };

  Player.prototype.executeMove = function(x, y) {
    for (var i = 0; i < this.game.planets.length; i++) {
      var planet = this.game.planets[i]; 
      if (planet.isWithin(x, y)) {
        this.selected.forEach(function(unit) {
          unit.planet = planet;
          unit.selected = false;
        });
        this.selected = []
        return;
      }
    }
    this.selected.forEach(function(unit) {
      unit.setDest(x, y);
      unit.planet = null;
      unit.selected = false;
    });
    this.selected = [];
  };

  return Player;

});
