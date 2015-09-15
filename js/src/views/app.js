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
      this.game.addPlanet(400, 100, 35, 1);
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
            _this.context.fillStyle = unit.selectedColor();
            _this.context.beginPath();
            _this.context.arc(unit.x, unit.y, 6, 0, 2 * Math.PI);
            _this.context.fill();
          }
        }
        _this.context.fillStyle = unit.color();
        _this.context.fillRect(unit.x,unit.y,2,2);
      });
    },

    renderPlanets: function() {
      var _this = this;
      this.game.planets.forEach(function(planet) {
        _this.context.fillStyle = planet.color();
        _this.context.beginPath();
        _this.context.arc(planet.x, planet.y, planet.r, 0, 2 * Math.PI);
        _this.context.fill();

        if (planet.owner !== null && planet.hp < 10) {
          _this.context.fillStyle = '#FFF'; 
          _this.context.fillRect(planet.x - planet.r, planet.y + planet.r + 5, 2 * planet.r, 8);
          _this.context.fillStyle = 'rgb(255,0,0)';
          _this.context.fillRect(planet.x - planet.r + 1, planet.y + planet.r + 6, (2 * planet.r) * (planet.hp / 10) - 1, 6);
        } else if (planet.owner === null) {
          for (var i = 0; i < planet.captureState.length; i++) {
            if (planet.captureState[i] > 0) {
              var pid = i + 1;  
              var num = planet.captureState[i];
              _this.context.fillStyle = '#FFF'; 
              _this.context.fillRect(planet.x - planet.r, planet.y + planet.r + 5, 2 * planet.r, 8);
              if (pid === 1) {
                _this.context.fillStyle = 'rgb(0,0,255)';
              } else if (pid === 2) {
                _this.context.fillStyle = 'rgb(255,0,0)';
              }
              _this.context.fillRect(planet.x - planet.r + 1, planet.y + planet.r + 6, (2 * planet.r) * (num / 10) - 1, 6);
            }
          }
        }
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
