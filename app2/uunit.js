var Unit = function(id, pid, x, y) {
  this.id = id;
  this.pid = pid;
  this.x = x;
  this.y = y;

  this.dest_x = null;
  this.dest_y = null;
  this.dead   = false;
  this.fight  = null;
  this.repair = null;
};

Unit.prototype.setDst = function(x, y) {
  this.dest_x = x;
  this.dest_y = y;
};

Unit.prototype.getDst = function(x, y) {
  var delta_x = x - this.x;
  var delta_y = y - this.y;
  return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
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

Unit.prototype.isIn = function(x1, y1, x2, y2) {
  var mx1 = Math.min(x1, x2);
  var mx2 = Math.max(x1, x2);
  var my1 = Math.min(y1, y2);
  var my2 = Math.max(y1, y2);
  if ((this.x >= mx1 && this.x <= mx2) && (this.y >= my1 && this.y <= my2)) {
    return true;
  }
  return false;
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

exports.Unit = Unit;
