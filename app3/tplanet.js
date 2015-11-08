var Planet = function Planet(id, owner, maxSize, x, y) {
  this.id      = id;
  this.owner   = owner;
  this.x       = x;
  this.y       = y;
  this.maxSize = maxSize;
  this.size    = 1;
  this.hp      = 10;
  this.upgrade = 0;
}

exports.Planet = Planet;
