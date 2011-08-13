exports.handleMessage = function(io_, message_) {
    var io = io_;
    var message = message_;

    if (message == null) { 
	throw "Null message cannot be handled.";
    };

    if (!message.type) {
	throw "No typed message cannot be handled.";
    };

    io.sockets.emit('message', {
	'type': "ACCEPTED",
	'msg': message
    });
};
