function Sticky(id) {
  var socket = io.connect(hosturl + "/sticky/" + id);
  socket.on('connect', function() {
      console.log('connect');
  });

  socket.on('disconnect', function() {
      console.log('disconnect');
  });

  socket.on('user message', function(msg) {
      console.log("user message received:" + msg);
      $('#' + id).text(msg);
      //socket.emit('user message', $(this).val());
  });
}

Sticky(1312614962224);
//Sticky(2);
