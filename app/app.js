var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(8000, function(){
  console.log('listening on port 8000');
});
