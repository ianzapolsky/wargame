define([
  'underscore',
], function(_) {

  var Player = function Player(pid) {
    this.pid = pid;
    this.selected = [];
    this.units = [];
  };

  Player.prototype.flagSelected = function(x1, y1, x2, y2) {
    var _this = this;
    this.units.forEach(function(unit) {
      if (unit.isWithin(x1, y1, x2, y2)) {
        _this.selected.push(unit);
      }
    });
  };

  Player.prototype.executeMove = function(x, y) {
    this.selected.forEach(function(unit) {
      unit.dest_x = x;
      unit.dest_y = y;
    });
    this.selected = [];
  };

  return Player;

});
