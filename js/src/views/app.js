define([
  'underscore',
  'jquery',
  'backbone',
  'src/game/game',
  'src/game/unit',
  'src/game/player',
], function(_, $, Backbone, Game, Unit, Player) {

  var AppView = Backbone.View.extend({

    el: 'body', 

    canvas: null,
    context: null,

    game: null,

    mousedown: false,
    down_x: null,
    down_y: null,
    curr_x: null,
    curr_y: null,

    initialize: function() {
      this.canvas = document.getElementById('c');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.context = this.canvas.getContext('2d');

      this.game = new Game();
      this.game.addPlanet(200, 200, 35, 1);
      this.game.addPlanet(400, 200, 35, 2);

      var _this = this;
      setInterval(function() {
        _this.game.doTick();
        _this.render();
      }, 50);
    },

    events: {
      'mousedown #c': 'handleMousedown',
      'mousemove #c': 'handleMousemove',
      'mouseup #c': 'handleMouseup',
    },

    handleMousedown: function(e) {
      this.mousedown = true;
      this.down_x = e.pageX;
      this.down_y = e.pageY;
    },

    handleMousemove: function(e) {
      this.curr_x = e.clientX;
      this.curr_y = e.clientY;
    },

    handleMouseup: function(e) {
      if ((Math.abs(e.clientX - this.down_x) < 3) &&
        Math.abs(e.clientY - this.down_y) < 3) {
        this.handleClick(e);
      } else {
        this.game.players[0].flagSelected(this.down_x, this.down_y,
          e.clientX, e.clientY);
      }
      this.mousedown = false;
      this.down_x = null;
      this.down_y = null;
    },

    handleClick: function(e) {
      this.game.players[0].executeMove(e.clientX, e.clientY);
    },

    render: function() {
      this.clearCanvas();
      this.renderPlanets();
      this.renderUnits();
      this.renderInteraction();
    },

    renderUnits: function() {
      var _this = this;
      this.game.units.forEach(function(unit) {
        if (unit.pid === 1) {
          if (unit.selected) {
            _this.context.fillStyle = 'rgba(21, 137, 255, .5)';
            _this.context.fillRect(unit.x-2,unit.y-2,6,6);
          }
          _this.context.fillStyle = '#1589FF';
        } else if (unit.pid === 2) {
          _this.context.fillStyle = '#F70D1A';
        }
        _this.context.fillRect(unit.x,unit.y,2,2);
      });
    },

    renderPlanets: function() {
      var _this = this;
      this.game.planets.forEach(function(planet) {
        if (planet.owner === 1) {
            _this.context.fillStyle = '#6495ED';
        } else if (planet.owner === 2) {
            _this.context.fillStyle = '#FF4500';
        } else {
            _this.context.fillStyle = 'rgba(100,100,100,1)';
        }
        _this.context.beginPath();
        _this.context.arc(planet.x, planet.y, planet.r, 0, 2 * Math.PI);
        _this.context.fill();
      });
    },

    renderInteraction: function() {
      if (this.mousedown) {
        this.context.fillStyle = 'rgba(245,245,245,.3)';
        this.context.fillRect(this.down_x, this.down_y,
          (this.curr_x - this.down_x), (this.curr_y - this.down_y));
        this.context.strokeStyle = 'rgba(255,255,255,.7)';
        this.context.strokeRect(this.down_x, this.down_y,
          (this.curr_x - this.down_x), (this.curr_y - this.down_y));
      }
    },

    clearCanvas: function() {
      this.context.fillStyle = '#000';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

  });

  return AppView;

});
