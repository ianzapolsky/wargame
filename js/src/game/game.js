define([
  'underscore',
  'src/game/unit',
  'src/game/player',
  'src/game/planet',
], function(_, Unit, Player, Planet) {
  
  var Game = function Game() {
    this.units = [];
    this.players = [new Player(this, 1), new Player(this, 2), new Player(this, 3)];
    this.planets = [];
    this.tick = 0;
  };
  
  Game.prototype.init = function() {
    this.addPlanet(200,200,35,1);
    this.addPlanet(200,400,35,1);
    this.addPlanet(200,600,35,1);
    this.addPlanet(400,200,35,2);
    //this.addPlanet(400,400,35,2);
    //this.addPlanet(600,200,35,3);
    //this.addPlanet(600,400,35,3);
  };

  Game.prototype.addUnit = function(pid, x, y, planet) {
    var u = new Unit(this, pid, x, y, planet);
    this.units.push(u);
    this.players[pid - 1].units.push(u);
  };

  Game.prototype.addPlanet = function(x, y, r, owner) {
    var p = new Planet(this, x, y, r, owner);
    this.planets.push(p);
  };

  Game.prototype.doTick = function() {
    this.tick += 1;

    this.removeDead();
    
    // add units
    if (this.tick % 50 === 0) {
      this.planets.forEach(function(planet) {
        planet.addUnit();
      });
    }

    // execute computer moves
    this.players.forEach(function(player) {
      if (player.pid === 1) {
        return;
      }
      player.computerMove();
    });

    // move units
    this.units.forEach(function(unit) {
      unit.act();
    });
  };

  Game.prototype.removeDead = function() {
    this.units = this.units.filter(function(unit) {
      return unit.dead === null;
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
