define([
  'underscore',
], function(_) {

  var Planet = function Player(game, x, y, r, owner) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.r = r;
    this.owner = owner;
    this.hp = 0;
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

  return Planet;

});
