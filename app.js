var express = require('express');
var app = express.createServer();
var ejs = require('ejs');
var io  = require('socket.io');

var port = 3000;
app.configure(function(){
    //app.use(express.staticProvider(__dirname + '/static'));
    app.use(express.static(__dirname + '/static'));
});
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

app.get('/editor', function(req, res) {
    console.log('/editor');
    res.render('editor', { locals: { port: port } });
});
app.get('/viewer', function(req, res) {
    console.log('/viewer');
    res.render('viewer', { locals: { port: port } });
});
app.listen(port);

var socket = io.listen(app);
socket.on('connection', function(socket) {
    socket.on('message', function(msg) {
	console.log(msg + " received");
        socket.broadcast.send(msg);
    });
    socket.on('disconnect', function() {
        console.log('disconnect');
    });
});

console.log('Server running at http://127.0.0.1:' + port + '/');
