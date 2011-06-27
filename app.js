var express = require('express');
var app = express.createServer();
var io  = require('socket.io').listen(app);
var ejs = require('ejs');

var port = 3000;
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/static'));
});

app.get('/editor', function(req, res) {
    console.log('/editor');
    res.render('editor', { locals: { port: port } });
});
app.get('/viewer', function(req, res) {
    console.log('/viewer');
    res.render('viewer', { locals: { port: port } });
});
//app.listen(port);

io.configure(function() {
    io.set('polling duration', 30);
});
io.configure('development', function() {
    io.set('log level', 3);
});

io.sockets.on('connection', function(socket) {
    socket.on('message', function(msg) {
	console.log(msg + " received");
        socket.broadcast.emit('user message', msg);
	io.sockets.emit('user message', msg);
    });
    socket.on('disconnect', function() {
        console.log('disconnect');
	socket.broadcast.emit('announcement', 'user disconnected');
    });
});

app.listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');
