define([
  'underscore',
], function(_) {

  var Planet = function Player(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.owner = null;
    this.hp = 0;
  };

  Planet.prototype.addUnit = function() {
    if (this.owner) {
      this.game.addUnit(this.owner, this.x, this.y, this);
    }
  };

  return Planet;

});
