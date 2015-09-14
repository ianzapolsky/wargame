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
    this.captureState = [];
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
        console.log(this.hp); 
        unit.dead = true;
      } 
    }
    this.updateState();
  };

  Planet.prototype.updateState = function() {
    if (this.hp === 0) {
      this.owner = null;
    }
  };

  return Planet;

});
