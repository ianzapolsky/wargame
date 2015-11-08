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
      var _this          = this;
      this.socket        = io('/' + window.location.hash.split('#')[1]);
      this.canvas        = document.getElementById('c');
      this.canvas.width  = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.context       = this.canvas.getContext('2d');

      this.socket.on('set player', function(pid) {
        _this.pid = pid;
      });

      this.socket.on('wait for player', function() {
        console.log('wait for player');
      });

      this.socket.on('game start', function(data) {
        _this.game = new Game(_this.socket);
        data.planets.forEach(function(p) {
          np = new Planet(_this.game, p);
          _this.game.planets[p.id] = np;
        });

        _this.clock = setInterval(function() {
          _this.render();
          _this.game.doTick();
          _this.game.detectEnd(_this.clock);
        }, 50);
      });

      this.socket.on('new units', function(newUnits) {
        //console.log('receiving new unit data'); 
        //console.log(newUnits);
        newUnits.forEach(function(u) {
          _this.game.units[u.id] = new Unit(_this.game, u); 
        });
      });
           
      this.socket.on('unit data', function(data) {
        //console.log('receiving data');
        //console.log(data);
        _this.ingestData(data);
      });
    },

    ingestData: function(data) {
      var _this = this;
      data.units.forEach(function(u) {
        if (typeof(_this.game.units[u.id]) !== 'undefined') {
          _this.game.units[u.id] = new Unit(_this.game, u);
        }
      });
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
      var selected = this.game.players[this.pid - 1].executeMove(e.clientX, e.clientY);
      if (selected.length > 0) {
        this.emitData(selected);
      }
    },

    emitData: function(units) {
      var unitData = [];
      units.forEach(function(u) {
        unitData.push({
          id    : u.id,
          pid   : u.pid,
          ptid  : u.planet !== null ? u.planet.id : null,
          x     : u.x,
          y     : u.y,
          dest_x: u.dest_x,
          dest_y: u.dest_y,
          dead  : u.dead,
          fight : u.fight,
          rid   : u.repair !== null ? u.repair.id : null 
        });
      });
      //console.log('emitting unit data: ' + unitData)
      this.socket.emit('p' + this.pid + ' unit data', {
        units: unitData,
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
        if (unit.dead === false) {
          Utils.drawUnit(_this.context, unit);
        }
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
