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

    // if the player has no selected units
    if (this.selected.length === 0) {
      for (var i = 0; i < this.game.planets.length; i++) {
        if (this.game.planets[i].owner === this.pid) {
          var planet = this.game.planets[i];
          if (planet.isWithin(x, y)) {
            for (var j = 0; j < this.units.length; j++) {
              if (this.units[j].planet === planet) {
                this.units[j].selected = true;
                this.selected.push(this.units[j]);
              }
            }
            break;
          }
        }
      }
      return;
    }

    for (var i = 0; i < this.game.planets.length; i++) {
      var planet = this.game.planets[i];
      if (planet.isWithin(x, y)) {
        this.selected.forEach(function(unit) {
          if (unit.planet === planet && planet.owner === unit.pid) {
            unit.repair = planet;
            unit.selected = false;
          } else {
            unit.repair = null
            unit.planet = planet;
            planet.units.push(unit);
            unit.selected = false;
          }
        });
        this.selected = []
        return;
      }
    }
    this.selected.forEach(function(unit) {
      unit.setDest(x, y);
      unit.repair = null
      unit.planet = null;
      unit.selected = false;
    });
    this.selected = [];
  };

  Player.prototype.computerMove = function() {
    var _this = this;
    this.units.forEach(function(u) {
      _this.game.planets.forEach(function(p) {
        if (p.owner !== _this.pid) {
          u.planet = p;
        }
      });
    });
  };

  return Player;

});
