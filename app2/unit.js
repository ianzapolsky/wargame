Unit.prototype.defendPlanet = function() {
  // if repairing, go repair
  if (this.repair !== null && (this.repair.hp < 10 || this.repair.size < 3)) {
    this.setDest(this.repair.x, this.repair.y);
    return;
  }

  // defend against attackers
  for (var i = 0; i < this.game.units.length; i++) {
    var unit = this.game.units[i];
    if (unit !== this && unit.fight === null && this.pid !== unit.pid &&
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
  if (this.planet !== null && this.fight === null) {
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
  //this.detectPlanet();
  //this.detectFight();
  this.moveToDest();
  this.detectDeath();
};

Unit.prototype.detectFight = function() {
  if (this.fight === null) {
    // fight anyone near you
    for (var i = 0; i < this.game.units.length; i++) {
      var unit = this.game.units[i];
      if (unit !== this && unit.fight === null && this.pid !== unit.pid &&
        this.getDist(unit.x, unit.y) < 10) {
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
  if (this.dead === false) {
    // attack enemy planet or repair own planet
    if (this.planet !== null &&
      this.getDist(this.planet.x, this.planet.y) < 2) {
      this.planet.merge(this);
      return;
    }
    // fight enemy unit
    for (var i = 0; i < this.game.units.length; i++) {
      var unit = this.game.units[i];
      if (unit !== this && unit.dead === false && unit.pid !== this.pid &&
        this.getDist(unit.x, unit.y) < 2) {
        this.dead = true;
        unit.dead = true;
        return;
      }
    }
  }
};
