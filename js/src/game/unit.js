define([
  'underscore',
  'src/game/game'
], function(_, Game) {

  var Unit = function Unit(game, pid, x, y) {
    this.game = game;
    this.pid = pid;
    this.x = x;
    this.y = y;
    this.dest_x = null;
    this.dest_y = null;
    this.dead = null;
    this.fight = null;
  };

  Unit.prototype.setDest = function(x, y) {
    this.dest_x = x;
    this.dest_y = y;
  };

  Unit.prototype.getDist = function(x, y) {
    var delta_x = x - this.x;
    var delta_y = y - this.y;
    return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
  };

  Unit.prototype.moveToDest = function() {
    if (this.dest_x && this.dest_y) {
      var delta_x = this.dest_x - this.x;
      var delta_y = this.dest_y - this.y;
      var distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
      if (distance > 1) {
        this.x += (delta_x / distance);
        this.y += (delta_y / distance);
      }
    }
  };

  Unit.prototype.isWithin = function(x1, y1, x2, y2) {
    var ax1 = Math.min(x1, x2);
    var ax2 = Math.max(x1, x2);
    var ay1 = Math.min(y1, y2);
    var ay2 = Math.max(y1, y2);
    if ((this.x >= ax1 && this.x <= ax2) && (this.y >= ay1 && this.y <= ay2)) {
      return true;
    }
    return false;
  };

  Unit.prototype.detectFight = function() {
    if (this.fight === null) {
      for (var i = 0; i < this.game.units.length; i++) {
        var unit = this.game.units[i];
        if (unit !== this && unit.fight === null && this.pid !== unit.pid &&
          this.getDist(unit.x, unit.y) < 10) {
          this.setDest(unit.x, unit.y);
          unit.setDest(this.x, this.y);
          this.fight = true;
          unit.fight = true;
          return;
        }
      }
    }
  };

  Unit.prototype.detectDeath = function() {
    if (this.dead === null) {
      for (var i = 0; i < this.game.units.length; i++) {
        var unit = this.game.units[i];
        if (unit !== this && unit.dead === null && unit.pid !== this.pid &&
          this.getDist(unit.x, unit.y) < 2) {
          this.dead = true;
          unit.dead = true;
          return;
        }
      }
    }
  };

  return Unit;

});

