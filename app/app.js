var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

var players = 0;

io.on('connection', function(socket) {

  players += 1;
  console.log('player ' + players + ' connected');
  if (players === 2) {
    io.emit('game start');
  }

  socket.on('game data', function(data) {
    console.log(data);
  });

  socket.on('disconnect', function() {
    console.log('player ' + players + ' disconnected');
    io.emit('user disconnect');
    players -= 1;
  });

});


http.listen(8000, function() {
  console.log('listening on port 8000');
});
