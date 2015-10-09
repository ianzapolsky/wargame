var Unit = require('./tunit.js').Unit;

var Game = function Game() {
  this.units = [];
  this.players = [];
  this.tick = 0;
};

Game.prototype.init = function() {
  this.units = [
    new Unit(1, 1, 40, 40),
    new Unit(2, 2, 80, 80)
  ];
};

exports.Game = Game;

