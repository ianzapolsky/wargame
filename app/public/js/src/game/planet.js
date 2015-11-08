define([
  'underscore',
], function(_) {

  // copy constructor
  var Planet = function Planet(game, planet) {
    this.game         = game;
    this.id           = planet.id;
    this.x            = planet.x;
    this.y            = planet.y;
    this.owner        = planet.owner;
    this.maxSize      = planet.maxSize;
    this.size         = planet.size;
    this.hp           = planet.hp;
    this.upgrade      = planet.upgrade;
    this.captureState = planet.captureState;
    this.r            = this.getR();

    this.initCaptureState();
  };

  Planet.prototype.getR = function() {
    switch (this.size) {
      case 1:
        return 35;
      case 2:
        return 45;
      case 3:
        return 55;
    }
  };

  Planet.prototype.initCaptureState = function() {
    this.captureState = [];
    for (var i = 0; i < this.game.players.length; i++) {
      this.captureState[i] = 0;
    }
  };

  Planet.prototype.isWithin = function(x, y) {
    if (Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) < this.r) {
      return true;
    }
    return false;
  };

  Planet.prototype.addUnit = function() {
    if (this.owner) {
      for (var i = 0; i < this.size; i++) {
        this.game.addUnit(this.owner, this.x, this.y, this);
      }
    }
  };

  Planet.prototype.merge = function(unit) {
    if (this.owner !== null) {
      if (unit.pid !== this.owner) {
        this.hp -= 1;
        unit.dead = true;
      } else {
        if (unit.repair === this && this.hp < 10) {
          this.hp += 1;
          unit.dead = true;
        } else if (unit.repair === this && this.hp === 10 && this.size < 3) {
          this.upgrade += 1;
          unit.dead = true;
        }
      }
    } else {
      for (var i = 0; i < this.game.players.length; i++) {
        if (unit.pid === i + 1) {
          continue;
        }
        if (this.captureState[i] > 0) {
          this.captureState[i] -= 1;
          unit.dead = true;
          this.updateState();
          return;
        }
      }
      this.captureState[unit.pid - 1] += 1;
      unit.dead = true;
    }
    this.updateState();
  };

  Planet.prototype.updateState = function() {
    var _this = this;
    if (this.hp === 0) {
      this.owner = null;
      this.size = 1;
      
      var pc = _.extend({}, this); 
      pc.game = null;
      this.game.nsp.emit('planet data', pc);
    }
    if (this.upgrade === 10) {
      this.size += 1;
      this.upgrade = 0;
      var _this = this;
      this.game.units.forEach(function(unit) {
        if (unit.planet === _this && unit.dead !== true) {
          unit.repair = null;
        }
      });

      var pc = _.extend({}, this); 
      pc.game = null;
      this.game.nsp.emit('planet data', pc);
    }
    for (var i = 0; i < this.captureState.length; i++) {
      if (this.captureState[i] === 10) {
        this.owner = i + 1;
        this.hp = 10;
        this.initCaptureState();

        var pc = _.extend({}, this); 
        pc.game = null;
        this.game.nsp.emit('planet data', pc);
      }

    }
    this.r = this.getR();
  };

  Planet.prototype.color = function() {
    if (this.owner === 1) {
      return 'rgba(70,70,200,1)';
    } else if (this.owner === 2) {
      return 'rgba(172,0,0,1)';
    } else if (this.owner === 3) {
      return 'rgba(50,170,50,1)';
    } else if (this.owner === null) {
      return 'rgba(100,100,100,1)';
    }
  };

  return Planet;

});
