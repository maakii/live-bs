var express = require('express');
var path = require('path');
var async = require('async');
var fs = require('fs');
var ejs = require('ejs');
var mongoose = require('mongoose');

// set the git version
var version = "";

try {
    var ref = fs.readFileSync("./.git/HEAD", "utf-8");
    var refPath = "./.git/" + ref.substring(5, ref.indexOf("\n"));
    version = fs.readFileSync(refPath, "utf-8");
    version = version.substring(0, 8);
} catch(e) {
    console.warn("Can't get git version for server header\n" + e.message);
}

var serverName = "Live-Stickies " + version + " (live-stickies.org)";

//cache 6 hours
exports.maxAge = 1000*60*60*6;

var host = "43.15.152.213";
var port = 3000;
var hosturl = "http://" + host + ":" + port;

var app = express.createServer();

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

/* Obsolete: */
app.get('/editor', function(req, res) {
    console.log('/editor');
    res.render('editor', { locals: { hosturl: hosturl } });
});
/* Obsolete: */
app.get('/viewer', function(req, res) {
    console.log('/viewer');
    res.render('viewer', { locals: { hosturl: hosturl } });
});

//serve static files
app.get('/static/*', function(req, res) { 
    res.header("Server", serverName);
    var filePath = path.normalize(__dirname + req.url.split("?")[0]);
    res.sendfile(filePath, { maxAge: exports.maxAge });
});

/* start routine */
app.get('/main', function(req, res) {
    console.log('/main');
    res.render('main', { locals: { hosturl: hosturl } });
});

/* json list of stickies specified by theme */
app.get('/list', function(req, res) {
    console.log('/list');
    //res.render('main', { locals: { hosturl: hosturl } });
});

app.listen(port);
console.log('Server running at ' + hosturl);

var io  = require('socket.io').listen(app);
io.configure(function() {
    io.set('polling duration', 30);
});

io.configure('development', function() {
    io.set('log level', 3);
});

// Mongoose
var Schema = mongoose.Schema;
var StickySchema = new Schema({
  obj: String
});
mongoose.model('Sticky', StickySchema);
mongoose.connect('mongodb://localhost/sticky_db');

//io.of('/message')
io.sockets
  .on('connection', function(socket) {

    socket.on('create', function(data) {
      console.log('create message received');
      var obj = data.obj;
      io.sockets.emit('created', {'obj': obj});
      //socket.broadcast.emit('created', {'obj': obj});
      //socket.emit('a message', {'msg': 'we are accepted'});
      //socket.emit('created', {'obj': obj});
    });

    socket.on('update', function(data) {
      console.log('update message received');
      var obj = data.obj;
      io.sockets.emit('updated', {'obj': obj});
    });

      // io.of('/sticky/' + obj.id).on('connection', function(socket) {
      //   console.log("sticky enabled -> " + obj.id);
      //   /* update sticky content */
      //   socket.on('message', function(msg) {
      //     console.log(msg + " received");
      //     socket.broadcast.emit('user message', msg);
      //   });

      //   /* finish sticky editing */
      //   socket.on('disconnect', function() {
      //     console.log('disconnect');
      //     socket.broadcast.emit('announcement', 'user disconnected');
      //   });
      // });
  });

// io.of('/create').on('connection', function(create) {
//   create.on('created', function(data) {
//     console.log("sticky assigned -> " + data.id);

//     //message.emit('a message', {'msg':'hi this is test message.'});
//     if (callback != null) {
//       console.log(callback);
//       callback('a message', {'msg':'hi this is test message.'});
//     }

//     /* assigned id for persistent connection */
//     io.of('/sticky/' + data.id).on('connection', function(socket) {

//       console.log("sticky enabled -> " + data.id);
//       /* update sticky content */
//       socket.on('message', function(msg) {
//         console.log(msg + " received");
//         socket.broadcast.emit('user message', msg);
//       });

//       /* finish sticky editing */
//       socket.on('disconnect', function() {
//         console.log('disconnect');
//         socket.broadcast.emit('announcement', 'user disconnected');
//       });
//     });
//   });
// });


/* open stickies */
//io.of('/open') {
//};

