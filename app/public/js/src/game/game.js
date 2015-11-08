define([
  'underscore',
  'src/game/unit',
  'src/game/player',
  'src/game/planet',
], function(_, Unit, Player, Planet) {
  
  var Game = function Game(nsp) {
    this.nsp     = nsp;
    this.units   = [];
    this.planets = [];
    this.players = [new Player(this, 1), new Player(this, 2)];
    this.tick    = 0;
  };
  
  Game.prototype.addUnit = function(pid, x, y, planet) {
    var u = new Unit(this, this.uid, pid, x, y, planet);
    this.units.push(u);
    this.players[pid - 1].units.push(u);
  };

  Game.prototype.doTick = function() {
    this.tick += 1;

    // move units
    this.units.forEach(function(unit) {
      if (unit.dead === false) {
        unit.act();
      }
    });
  };

  Game.prototype.detectEnd = function(clock) {
    if (this.planets.filter(function(p) { return p.owner === 1; }).length === 0) {
      this.end(clock, false);
    }
    if (this.planets.filter(function(p) { return p.owner !== null && p.owner !== 1; }).length === 0) {
      this.end(clock, true);
    }
  };

  Game.prototype.end = function(clock, win) {
    if (win) {
      alert('player wins');
    } else {
      alert('player loses');
    }
    clearInterval(clock);
  };

  return Game;

});
