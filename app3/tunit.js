var Unit = function(id, pid, ptid, x, y) {
  this.id     = id;
  this.pid    = pid;
  this.ptid   = ptid;
  this.x      = x;
  this.y      = y;
  this.dest_x = null;
  this.dest_y = null;
  this.planet = null;
  this.fight  = false;
  this.rid    = null;
  this.dead   = false;
};

exports.Unit = Unit;
