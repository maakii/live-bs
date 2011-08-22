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

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StickySchema = new Schema({
    theme: String,
    id: Number,
    date: Number,
    top: Number,
    left: Number,
    title: String,
    fontsize: Number,
    textcolor: String,
    notecolor: String,
    zindex: Number,
    width: Number
// e.g. {"id":1314020377056,"date":1314020377056,"top":"145px","left":"206px","title":"New Title","fontsize":14,"textcolor":"#111","notecolor":"#ffee74","zindex":1,"width":200}
});

var StickyModel = mongoose.model('StickySchema', StickySchema);

exports.init = function() {
    mongoose.connect('mongodb://localhost/sticky_db');    
};

exports.sampleDo = function() {
    var instance = new StickyModel();
    instance.id = '100';
    instance.date = '200';
    instance.title = "hogehoge";
    instance.save(function (err) {
	if (!err) {
	    console.log('success');
	} else {
	    console.log('failed ' + err);
	};
    });

    StickyModel.find({"id":100}, function(err, docs) {
	docs.forEach(function(doc) {
	    console.log(doc.id);
	});
    });
};

//exports.insertOrUpdateSticky({"id":100,...})
