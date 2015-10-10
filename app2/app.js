var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Game = require('./tgame.js').Game;

app.use(express.static('public'));

var runGame = function(nsp) {

  var players = 0;
  var game = new Game();

  nsp.on('connection', function(socket) {

    players += 1;

    if (players === 1) {
      socket.join('p1');
      nsp.emit('wait for player');
    }

    if (players === 2) {
      socket.join('p2');
      nsp.to('p1').emit('set player', 1);
      nsp.to('p2').emit('set player', 2);

      game.init();

      nsp.emit('game start', game);

    }

    if (players > 2) {
      process.exit();
    }

    socket.on('game data', function(data) {
      console.log(data);
      nsp.emit('game data', data);
    });

  });

};

var nsp = io.of('/room');
runGame(nsp);

http.listen(8000, function() {
  console.log('listening on port 8000');
});
