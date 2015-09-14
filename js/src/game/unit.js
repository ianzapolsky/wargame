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
      var delta_x = this.dest_x - this.x;
      var delta_y = this.dest_y - this.y;
      var distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
      this.x += (delta_x / distance);
      this.y += (delta_y / distance);
    }
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

  return Unit;

});

