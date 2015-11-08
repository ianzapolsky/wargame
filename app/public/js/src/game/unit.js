define([
  'underscore',
  'src/game/game'
], function(_, Game) {

  // copy constructor
  var Unit = function Unit(game, u) {
    this.game   = game;
    this.id     = u.id;
    this.pid    = u.pid;
    this.x      = u.x;
    this.y      = u.y;
    this.dest_x = u.dest_x;
    this.dest_y = u.dest_y;
    this.planet = u.ptid !== null ? game.planets[u.ptid] : null;
    this.dead   = u.dead;
    this.fight  = u.fight;
    this.repair = u.rid !== null ? game.planets[u.rid] : null;
  };

  Unit.prototype.setDest = function(x, y) {
    this.dest_x = x;
    this.dest_y = y;
  };

  Unit.prototype.getDist = function(x, y) {
    var delta_x = x - this.x;
    var delta_y = y - this.y;
    return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
  };

  Unit.prototype.defendPlanet = function() {
    // if repairing, go repair
    if (this.repair !== null && (this.repair.hp < 10 || this.repair.size < 3)) {
      this.setDest(this.repair.x, this.repair.y);
      return;
    }

    // defend against attackers
    for (var i = 0; i < this.game.units.length; i++) {
      var unit = this.game.units[i];
      if (unit !== this && unit.fight !== null && unit.dead !== true &&
        this.pid !== unit.pid &&
        unit.getDist(this.planet.x, this.planet.y) < (1.5 * this.planet.r)) {
        this.setDest(unit.x, unit.y);
        return;
      }
    }

    // otherwise orbit or go to planet
    if (this.getDist(this.planet.x, this.planet.y) < this.planet.r) {
      if (this.dest_x === null || this.dest_y === null ||
        this.getDist(this.dest_x, this.dest_y) < 5) {
        var r = this.planet.r;
        this.setDest(this.planet.x + (Math.random() * (-r - r) + r),
          this.planet.y + Math.random() * (-r - r) + r);
      }
    } else {
      this.setDest(this.planet.x, this.planet.y);
    }
  };

  Unit.prototype.detectPlanet = function() {
    if (this.planet !== null && this.fight !== true) {
      if (this.planet.owner === this.pid) {
        this.defendPlanet();
      } else {
        this.setDest(this.planet.x, this.planet.y);
      }
    }
  };

  Unit.prototype.moveToDest = function() {
    if (this.dest_x && this.dest_y) {
      var delta_x = this.dest_x - this.x;
      var delta_y = this.dest_y - this.y;
      var distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
      if (distance > 1) {
        this.x += (delta_x / distance);
        this.y += (delta_y / distance);
      }
    }
  };

  Unit.prototype.act = function() {
    this.detectPlanet();
    this.detectFight();
    this.moveToDest();
    this.detectDeath();
  };

  Unit.prototype.isWithin = function(x1, y1, x2, y2) {
    var ax1 = Math.min(x1, x2);
    var ax2 = Math.max(x1, x2);
    var ay1 = Math.min(y1, y2);
    var ay2 = Math.max(y1, y2);
    if ((this.x >= ax1 && this.x <= ax2) && (this.y >= ay1 && this.y <= ay2)) {
      return true;
    }
    return false;
  };

  Unit.prototype.detectFight = function() {
    if (this.fight !== true) {
      // fight anyone near you
      for (var i = 0; i < this.game.units.length; i++) {
        var unit = this.game.units[i];
        if (unit !== this && unit.fight !== true && unit.dead !== true &&
          this.pid !== unit.pid && this.getDist(unit.x, unit.y) < 10) {
          this.setDest(unit.x, unit.y);
          unit.setDest(this.x, this.y);
          this.fight = true;
          unit.fight = true;
          return;
        }
      }
    }
  };

  Unit.prototype.detectDeath = function() {
    if (this.dead !== true) {
      // attack enemy planet or repair own planet
      if (this.planet !== null &&
        this.getDist(this.planet.x, this.planet.y) < 2) {
        this.planet.merge(this);
        return;
      }
      // fight enemy unit
      for (var i = 0; i < this.game.units.length; i++) {
        var unit = this.game.units[i];
        if (unit !== this && unit.dead !== true && unit.pid !== this.pid &&
          this.getDist(unit.x, unit.y) < 2) {
          this.dead = true;
          unit.dead = true;
          return;
        }
      }
    }
  };

  Unit.prototype.color = function() {
    if (this.pid === 1) {
      return 'rgba(50,150,255,1)'; 
    } else if (this.pid === 2) {
      return 'rgba(255,50,150,1)';
    } else if (this.pid === 3) {
      return 'rgba(255,255,255,1)';
    }
  };

  Unit.prototype.selectedColor = function() {
    if (this.pid === 1) {
      return 'rgba(21,137,255,.5)'; 
    } else if (this.pid === 2) {
      return 'rgba(150,150,150,.5)';
    } else if (this.pid === 3) {
      return 'rgba(0,255,0,.5)';
    }
  };

  return Unit;

});

