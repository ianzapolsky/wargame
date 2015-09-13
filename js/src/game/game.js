define([
  'underscore',
], function(_) {
  
  var Game = function Game(width, height) {
    this.width = width;
    this.height = height;
    this.units = [];
  };

  Game.prototype.tick = function() {
    _.each(this.units, function(unit) {
      unit.moveToDest();
    });
  };

  return Game;

});
