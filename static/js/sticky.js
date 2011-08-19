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

/*
 * @method
 * @param {Object} data
 * @param {Object} geo
 */
var sticky = function(data, geo, orig) {
    console.log("sticky.create");
    data = data || {
	id           : + (new Date()), // assigned by the server
	date         : + (new Date()),
	top          : geo.top + 'px',
	left         : geo.left + 'px',
	title        : 'New Title',
	fontsize     : 14,
	textcolor    : '#111',
        notecolor    : '#ffee74', // yellow
//      notecolor    : '#ffb4cc', // pink
//      notecolor    : '#8ec4e1', // blue
//      notecolor    : '#b9df87', // green
	zindex      : 1,
	width        : 200
    };

    var note = $('<div />', {
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
        .append($('<div />', {
	    'class'	: 'ui-icon ui-icon-setting',
	    'title'	: 'Settings',
	}))
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
	    'z-index'     : data.zindex,
            'width'       : data.width
	})
	.appendTo(document.body)
   	.fadeIn(200);

    // specifying geo means that this sticky created by own
    if (geo) {
	message_send("STICKY_CREATE", data);
    }

    // sticky text area update
    $('#' + data.id + " .sticky-content").keyup(function() {
	var div = $('#' + data.id);
	var text = div.find('.sticky-content').html()
	console.log("#" + data.id + ":" + text);
	data.text = text;
	message_send("STICKY_UPDATE", data);
    });

    // maybe moved to somewhere
    $('#' + data.id).mouseup(function(event) {
	var div = $('#' + data.id);
	data.top = div.css('top');
	data.left = div.css('left');
	message_send("STICKY_UPDATE", data);
	console.log("move: (" + event.pageX + "," + event.pageY + ")");
    });

    $('#options-dialog').dialog({
	autoOpen: false,
	modal: true,
	height: 500,
	width: 400,
	buttons: {
	    "Close": function() {
		$(this).dialog("close");
	    }
	}
    });

    $('#sticky-input-title').keyup(function() {
	data.id = $(this).parents('#options-dialog').attr('rel');
	var div = $('#' + data.id);
	data.title = $('#sticky-input-title').val();
	div.find('h1.sticky-title').html(data.title);
	message_send("STICKY_UPDATE", data);
    });

    $('.sticky-title').click(function() {
	var div = $('#' + data.id);
	data.zindex = div.css('z-index');
	message_send("STICKY_UPDATE", data);
	//console.log("z-index:" + data.zindex);
    });

    $('ul#options-notecolor li').click(function() {
	var id = $(this).parents('#options-dialog').attr('rel');
	var notecolor = $(this).css('background-color');
	$('#' + id).css('backgroundColor', notecolor);
	data.id = id;
	data.notecolor = notecolor;
	message_send("STICKY_UPDATE", data);
    });

    $('#' + data.id + ' .ui-icon-setting').click(function() {
        $('#options-dialog').attr('rel', $(this).parents('.sticky').attr('id')).dialog('open');
    });

    return { id: data.id, div: note };
};
