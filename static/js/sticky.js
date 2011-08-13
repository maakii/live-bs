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
    var self = {
	create: function (data) {
	    console.log("sticky.create");
	    data = data || {
		id           : + new Date(), // assigned by the server
		date         : + new Date(),
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
	    return $note;
	},

	update: function () {
	},

	discard: function () {
	}
    };
    return self;
})();
