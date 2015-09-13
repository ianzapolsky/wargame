define([
  'underscore',
], function(_) {
  
  var Unit = function Unit(pid, x, y) {
    this.pid = pid;
    this.x = x;
    this.y = y;
    this.dest_x = null;
    this.dest_y = null;
  };

  Unit.prototype.setDest = function(x, y) {
    this.dest_x = x;
    this.dest_y = y;
  };

  Unit.prototype.moveToDest = function() {
    if (this.dest_x && this.dest_y) {
      var delta_x = this.x - this.dest_x; 
      var delta_y = this.y - this.dest_y;
      var distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
      delta_x /= distance;
      delta_y /= distance;
      this.x -= delta_x;
      this.y -= delta_y;
    }
  }

  return Unit;

});

