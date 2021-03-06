/*
 * Copyright (c) 2011, Masaaki Isozu <m.isozu@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var io;
exports.setSocketIO = function(io_) {
  io = io_;
  io.sockets.on('connection', function(socket) {
	var handler = require('./handler');

        //console.log("session id=" + socket.id);
	socket.on('message', function(message) {
	    handler.handleMessage(io, socket, message);
	});

	socket.on('disconnect', function() {
	    handler.handleDisconnect(io);
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
	    //socket.broadcast.emit('updated', {'obj': obj});
	    io.sockets.emit('updated', {'obj': obj});
	});
  });
};
