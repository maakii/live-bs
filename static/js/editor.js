function StickyEditable(id) {

  var socket = io.connect(hosturl + "/create");
  socket.on('connect', function() {
    /* request the connection by id */
    socket.emit('created', {"id": id});
    console.log('connection established:' + id);

    var sticky = io.connect(hosturl + "/sticky/" + id);
    sticky.on('connect', function() {
      var content_prev = $('#' + id).val();
      var update = function() {
          var content = $('#' + id).val();
          if (content != undefined) {
            content = content.replace(/(\n|\r)+/g, "<br>");
          }
          if (content_prev != content) {
              sticky.send(content);
              content_prev = content;
          }
          timer = setTimeout(update, 100);
      };
      update();
    });

  });

  socket.on('disconnect', function(){
    console.log('disconnect');
    //cancelTimeout(timer);
  });
}

StickyEditable(1);
StickyEditable(2);
