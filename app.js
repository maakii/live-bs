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

var host = "localhost";
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

/* start routine alternative */
app.get('/live', function(req, res) {
    console.log('/live');
    res.render('live', { locals: { hosturl: hosturl } });
});

/* json list of stickies specified by theme */
app.get('/list', function(req, res) {
    console.log('/list');
    //res.render('main', { locals: { hosturl: hosturl } });
});

app.listen(port);
console.log('Server running at ' + hosturl);

var io  = require('socket.io').listen(app);
//io.configure('development', function() {
io.configure(function() {
    io.set('polling duration', 30);
    io.set('log level', 3);
});

// Mongoose
// var Schema = mongoose.Schema;
// var StickySchema = new Schema({
//   obj: String
// });
// mongoose.model('Sticky', StickySchema);
// mongoose.connect('mongodb://localhost/sticky_db');

var router = require("./router");
router.setSocketIO(io);
