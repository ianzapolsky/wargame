define([
  'underscore',
  'jquery',
  'backbone',
  'socketio',
  'src/game/game',
  'src/game/unit',
  'src/game/planet',
  'src/game/player',
  'src/views/utils',
], function(_, $, Backbone, io, Game, Unit, Planet, Player, Utils) {

  var AppView = Backbone.View.extend({

    el: 'body',

    canvas: null,
    context: null,

    game: null,
    pid: null,

    mousedown: false,
    down_x: null,
    down_y: null,
    curr_x: null,
    curr_y: null,

    initialize: function() {
      var _this = this;
      this.socket = io('/' + window.location.hash.split('#')[1]);
      this.canvas = document.getElementById('c');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.context = this.canvas.getContext('2d');

      this.socket.on('wait for player', function() {
        console.log('wait for player');
      });

      this.socket.on('set player', function(pid) {
        _this.pid = pid;
      });

      this.socket.on('game data', function(data) {
        _this.ingestData(data);
      });

      this.socket.on('game start', function(data) {
        _this.game = new Game();
        _this.ingestData(data);

        _this.game.planets.forEach(function(p) { p.initCaptureState(); });

        _this.clock = setInterval(function() {
          _this.render();
          _this.game.doTick();
          _this.emitData();     
        }, 50);
      });

    },
    
    ingestData: function(data) {
      var _this = this;

      this.game.planets = [];
      data.planets.forEach(function(planet) {
        _this.game.planets.push(new Planet(_this.game, planet));
      });

      // update state of old units
      for (var i = 0; i < _this.game.units.length && i < data.units.length; i++) {
        var gunit = _this.game.units[i];
        var newUnit = data.units[i];
        gunit.id = newUnit.id;
        gunit.pid = newUnit.pid;
        gunit.x = newUnit.x;
        gunit.y = newUnit.y;
        gunit.dest_x = newUnit.dest_x;
        gunit.dest_y = newUnit.dest_y;
        gunit.repair = newUnit.repair;
        gunit.dead = newUnit.dead;
        gunit.fight = newUnit.fight;
        if (newUnit.planet !== null) {
          for (var j = 0; j < _this.game.planets.length; j++) {
            if (newUnit.planet.id === _this.game.planets[j].id) {
              gunit.planet = _this.game.planets[j];

              gunit.planet.game = _this.game;

              if (newUnit.repair !== null) {
                if (newUnit.repair.id === _this.game.planets[j].id) {
                  gunit.repair = _this.game.planets[j];
                }
              } else {
                gunit.repair = null;
              }
            }
          }
        } else {
          gunit.planet = null;
          gunit.repair = null;
        }
      }  

      // add new units to the mix
      for (var i = _this.game.units.length; i < data.units.length; i++) {
        var unit = data.units[i];
        var newUnit = new Unit(_this.game, unit);
        if (newUnit.planet !== null) {
          for (var j = 0; j < _this.game.planets.length; j++) {
            if (newUnit.planet.id === _this.game.planets[j].id) {
              newUnit.planet = _this.game.planets[j];
              newUnit.planet.game = _this.game;
              if (newUnit.repair !== null) {
                if (newUnit.repair.id === _this.game.planets[j].id) {
                  newUnit.repair = _this.game.planets[j];
                }
              }
            }
          }
        }
        _this.game.units.push(newUnit);
      }
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
        this.game.players[this.pid - 1].flagSelected(this.down_x, this.down_y,
          e.clientX, e.clientY);
      }
      this.mousedown = false;
      this.down_x = null;
      this.down_y = null;
    },

    handleClick: function(e) {
      var _this = this;
      this.game.players[this.pid - 1].executeMove(e.clientX, e.clientY);
      this.emitData();
    },

    emitData: function() {
      var unitsData = [];
      this.game.units.forEach(function(unit) {
        unitsData.push({
          id:unit.id,
          pid:unit.pid,
          x:unit.x,
          y:unit.y,
          dest_x:unit.dest_x,
          dest_y:unit.dest_y,
          planet:unit.planet,
          dead:unit.dead,
          fight:unit.fight,
          repair:unit.repair
        });
      });
      unitsData.forEach(function(unit) {
        if (unit.planet) {
          unit.planet.game = null;
        }
      });

      var planetsData = [];
      this.game.planets.forEach(function(planet) {
        planetsData.push({
          id:planet.id,
          owner:planet.owner,
          x:planet.x,
          y:planet.y,
          hp:planet.hp,
          upgrade:planet.upgrade,
          captureState:planet.captureState,
          maxSize:planet.maxSize,
          size:planet.size
        });
      });

      this.socket.emit(this.player+' game data', {
        units:unitsData,
        planets:planetsData
      });
    },

    render: function() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.clearCanvas();
      this.renderPlanets();
      this.renderUnits();
      this.renderInteraction();
    },

    renderUnits: function() {
      var _this = this;
      this.game.units.forEach(function(unit) {
        Utils.drawUnit(_this.context, unit);
      });
    },

    renderPlanets: function() {
      var _this = this;
      this.game.planets.forEach(function(planet) {
        Utils.drawPlanet(_this.context, planet);
      });
    },

    renderInteraction: function() {
      if (this.mousedown) {
        this.context.fillStyle = 'rgba(245,245,245,.3)';
        this.context.fillRect(this.down_x, this.down_y,
          (this.curr_x - this.down_x), (this.curr_y - this.down_y));
        this.context.lineWidth = 1;
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
