define([
  'underscore',
  'jquery',
  'backbone',
  'src/game/game',
  'src/game/unit',
], function(_, $, Backbone, Game, Unit) {

  var AppView = Backbone.View.extend({

    el: 'body', 

    canvas: null,
    context: null,

    game: null,

    initialize: function() {
      this.canvas = document.getElementById('c');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.context = this.canvas.getContext('2d');
      
      this.game = new Game(this.canvas.width, this.canvas.height);
      var u = new Unit(1, 40, 40);
      u.dest_x = 20;
      u.dest_y = 20;
      this.game.units.push(u);

      var _this = this;
      setInterval(function() {
        _this.game.tick();
        _this.render();
      }, 100);
    },

    render: function() {
      this.clearCanvas();
      var _this = this;
      _.each(this.game.units, function(unit) {
        if (unit.pid === 1) {
          _this.context.fillStyle = '#1589FF';
        } else if (unit.pid === 2) {
          _this.context.fillStyle = '#F70D1A';
        }
        _this.context.fillRect(unit.x,unit.y,2,2);
      });
    },

    clearCanvas: function() {
      this.context.fillStyle = '#000';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

  
  });

  return AppView;

});
