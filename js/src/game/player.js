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
    this.selected.forEach(function(unit) {
      unit.setDest(x, y);
      unit.planet = null;
      unit.selected = false;
    });
    this.selected = [];
  };

  return Player;

});
