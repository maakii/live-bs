var io;
exports.setSocketIO = function(io_) {
    io = io_;
    io.sockets.on('connection', function(socket) {

	// need handler.handleConnect()?

	socket.on('message', function(message) {
	    var handler = require("./handler");
	    handler.handleMessage(io, message);
	});

	// obsolete?
	socket.on('create', function(data) {
	    console.log('create message received');
	    var obj = data.obj;
	    io.sockets.emit('created', {'obj': obj});
	    //socket.broadcast.emit('created', {'obj': obj});
	    //socket.emit('a message', {'msg': 'we are accepted'});
	    //socket.emit('created', {'obj': obj});
	});

	// obsolete?
	socket.on('update', function(data) {
	    console.log('update message received');
	    var obj = data.obj;
	    io.sockets.emit('updated', {'obj': obj});
	});

	socket.on('disconnect', function() {
	    handler.handleDisconnect(io);
	});
    });
};