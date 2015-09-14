define([
  'underscore',
], function(_) {

  var Planet = function Planet(game, x, y, r, owner) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.r = r;
    this.owner = owner;
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
      } 
    } else {
      for (var i = 0; i < this.game.players.length; i++) {
        if (i + 1 === unit.pid) {
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

  return Planet;

});
