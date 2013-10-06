module.exports = function(server,app) {
  //Socket.io
  var sio = require('socket.io').listen(server, {log: false});
  sio.sockets.on('connection', function(socket){
    socket.on('subscribe', function(data) { socket.join(data.room); });
    socket.on('unsubscribe', function(data){ socket.leave(data.room);});
  });

  //Custom SocketIO middleware
  app.use(function(req, res, next) {
    req.socketio = sio;
    next();
  });
}