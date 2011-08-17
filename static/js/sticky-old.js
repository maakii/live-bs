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

var sticky = (function() {
    var id = "111";
    var prev = "";
    var self = {
	create: function (data, orig) {
	    console.log("sticky.create");
	    data = data || {
		id           : + (new Date()), // assigned by the server
		date         : + (new Date()),
		top          : TOP + 'px',
		left         : LEFT + 'px',
		title        : 'Click here to edit',
		fontsize     : 16,
		textcolor    : '#111',
                notecolor    : '#ffee74', // yellow
//              notecolor    : '#ffb4cc', // pink
//              notecolor    : '#8ec4e1', // blue
//              notecolor    : '#b9df87', // green
		width        : 200
	    };

            id = data.id;

	    var $note = $('<div />', {
		'class' : 'sticky',
		'id': data.id
	    })
            .append($('<h1 />', {
                'class' : 'sticky-title',
                html : data.title,
                'title' : 'Double-click to edit title'
	    }))
            .append($('<div />', {
                    'class' : 'sticky-content',
                    html : data.text,
                    contentEditable : true
                }).css({
                    'font-size' : data.fontsize,
                    'color' : data.textcolor
                })
            )
	     .draggable({
			handle		: '.sticky h1',
			stack		: '.sticky',
			containment	: 'body',
			cancel		: '.sticky-content, .button, .settings, h1.edit, .grid, .ui-icon',
			distance	: 0
            })
            .css({
		position      : 'absolute',
                'top'         : data.top,
                'left'        : data.left,
                'display'     : 'none',
                'background-color' : data.notecolor,
                'width'       : data.width
	    })
	    .appendTo(document.body)
   	    .fadeIn(200);
	    // this sticky created by own
	    if (orig) {
		message_send("STICKY_CREATE", data);
	    }

	    // add watch function;
	    var watch = function () {
		console.log("watching..." + data.id);
		var div = $('#' + id);
		var current = div.find('.sticky-content').html()
		if (prev != current) {
		    console.log("data changed: " + current + " (" + data.id + ")");
		    prev = current;
		    // emit
		    data.text = current;
		    message_send("STICKY_UPDATE", data);
 		}
		timer = setTimeout(watch, 3000);
	    }
	    watch();
	    //return $note;
	    return id;
	},

	update: function (data) {
	    var div = $('#' + id);
	},

        watch: function () {
	    var div = $('#' + id);
	    data = {
		id    : div.attr(id),
		top   : div.css('top'),
		left  : div.css('left'),
		title : div.find('h1.sticky-title').html(),
		text  : div.find('.sticky-content').html(),
		notecolor : div.css('background-color'),
		width : div.css('width')
	    };
	    
	    console.log("watch called!");
	    current = JSON.stringify(data);
	    if (prev != current) {
		console.log("data changed: " + data.text);
		prev = current;
		// emit
		message_send("STICKY_UPDATE", data);
 	    }
	    timer = setTimeout(self.watch, 3000);
	},

	discard: function () {
	}
    };
    //self.watch();
    return self;
})();
