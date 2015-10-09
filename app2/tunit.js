var Unit = function(id, pid, x, y) {
  this.id = id;
  this.pid = pid;
  this.x = x;
  this.y = y;
  
  this.dest_x = null;
  this.dest_y = null;

  this.computeColor();
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

Unit.prototype.computeColor = function() {
  this.color = this.color();
  this.selectedColor = this.selectedColor();
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
