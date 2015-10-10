var Unit = function(id, pid, x, y) {
  this.id = id;
  this.pid = pid;
  this.x = x;
  this.y = y;
  
  this.dest_x = null;
  this.dest_y = null;

  this.planet = null;
  this.fight = false;
  this.repair = false;
  this.dead = false;
};

Unit.prototype.setDst = function(x, y) {
  this.dest_x = x;
  this.dest_y = y;
};

Unit.prototype.goToDst = function() {
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

exports.Unit = Unit;
