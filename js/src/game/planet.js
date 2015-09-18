define([
  'underscore',
], function(_) {

  var Planet = function Planet(game, x, y, r, owner) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.r = r;
    this.owner = owner;
    this.units = [];
    this.hp = 10;
    this.initCaptureState();
  };

  Planet.prototype.initCaptureState = function() {
    this.captureState = [];
    for (var i = 0; i < this.game.players.length; i++) {
      this.captureState[i] = 0;
    }
  };

  Planet.prototype.isWithin = function(x, y) {
    if (Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) < this.r) {
      return true;
    }
    return false;
  };

  Planet.prototype.addUnit = function() {
    if (this.owner) {
      this.game.addUnit(this.owner, this.x, this.y, this);
    }
  };

  Planet.prototype.merge = function(unit) {
    if (this.owner !== null) {
      if (unit.pid !== this.owner) {
        this.hp -= 1;
        unit.dead = true;
      } else {
        if (unit.repair === this && this.hp < 10) {
          this.hp += 1;
          unit.dead = true;
        }
      }
    } else {
      for (var i = 0; i < this.game.players.length; i++) {
        if (unit.pid === i + 1) {
          continue;
        }
        if (this.captureState[i] > 0) {
          this.captureState[i] -= 1;
          unit.dead = true;
          this.updateState();
          return;
        }
      }
      this.captureState[unit.pid - 1] += 1;
      unit.dead = true;
    }
    this.updateState();
  };

  Planet.prototype.updateState = function() {
    if (this.hp === 0) {
      this.owner = null;
    }
    for (var i = 0; i < this.game.players.length; i++) {
      if (this.captureState[i] === 10) {
        this.owner = i + 1;
        this.hp = 10;
        this.initCaptureState();
      }
    }
  };

  Planet.prototype.color = function() {
    if (this.owner === 1) {
      return 'rgba(70,70,200,1)';
    } else if (this.owner === 2) {
      return 'rgba(172,0,0,1)';
    } else if (this.owner === 3) {
      return 'rgba(50,170,50,1)';
    } else if (this.owner === null) {
      return 'rgba(100,100,100,1)';
    }
  };

  return Planet;

});
