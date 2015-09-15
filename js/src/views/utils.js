define([
  'underscore'
], function(_) {
  
  var Utils = {

    drawPlanet: function(ctx, p) {
      ctx.fillStyle = p.color();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fill();
      this.drawPlanetStatus(ctx, p);
    },

    drawPlanetStatus: function(ctx, p) {
      if (p.owner !== null && p.hp < 10) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(p.x - p.r, p.y + p.r + 5, 2 * p.r, 8);
        ctx.fillStyle = p.color();
        ctx.fillRect(p.x - p.r + 1, p.y + p.r + 6, (2*p.r) * (p.hp/10) - 1, 6);
      } else if (p.owner === null) {
        for (var i = 0; i < p.captureState.length; i++) {
          if (p.captureState[i] > 0) {
            var pid = i + 1;
            var num = p.captureState[i];
            ctx.fillStyle = '#FFF';
            ctx.fillRect(p.x - p.r, p.y + p.r + 5, 2 * p.r, 8);
            if (pid === 1) {
              ctx.fillStyle = 'rgb(0,0,255)';
            } else if (pid === 2) {
              ctx.fillStyle = 'rgb(255,0,0)';
            }
            ctx.fillRect(p.x - p.r + 1, p.y + p.r + 6, (2*p.r)*(num/10) - 1, 6);
          }
        }
      }
    },

    drawUnit: function(ctx, u) {
      if (u.pid === 1 && u.selected === true) {
        ctx.fillStyle = u.selectedColor();
        ctx.beginPath();
        ctx.arc(u.x, u.y, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.fillStyle = u.color(); 
      ctx.fillRect(u.x, u.y, 2, 2);
    }

  };

  return Utils;

});
