$(function() {
    //var socket = new io.Socket(null, { port: port });
    //socket.connect();
    var socket = io.connect('http://localhost:3000/')
    socket.on('connect', function() {
        console.log('connect');
    });
    socket.on('disconnect', function() {
        console.log('disconnect');
    });
    socket.on('message', function(msg) {
        console.log(msg);
        $('#code').text(msg);
    });
});
