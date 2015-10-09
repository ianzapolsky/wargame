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
    this.game.units.forEach(function(unit) {
      if (unit.pid === _this.pid) {
        unit.selected = false;
        
        if (isWithin(unit.x, unit.y, x1, y1, x2, y2)) {
          unit.selected = true;
          _this.selected.push(unit);
        }
      }
    });
  };

  isWithin = function(x, y, x1, y1, x2, y2) {
    var ax1 = Math.min(x1, x2);
    var ax2 = Math.max(x1, x2);
    var ay1 = Math.min(y1, y2);
    var ay2 = Math.max(y1, y2);
    if ((x >= ax1 && x <= ax2) && (y >= ay1 && y <= ay2)) {
      return true;
    }
    return false;
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
      unit.dest_x = x;
      unit.dest_y = y;
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
