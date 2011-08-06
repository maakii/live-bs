String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
};

var version = '1.3';
var TOP = 0;
var LEFT = 0;

$(document).ready(function() {
	
	/* SANITIZE PASTED TEXT */

	/*
	$('.sticky-content').live('paste', function() {
		var text = $(this).html();
		$(this).html(text.replace(/<(.|\n)*?>/g, ''));
	});
	*/
	
	/* WHAT'S NEW */
	
	var wnh = $('#whatsnew').height();
	
	if (localStorage['whatsnew-v' + version] == undefined || localStorage['whatsnew-v' + version] != 'clicked') {
		$('#whatsnew-wrapper').show();
	}
	$('#whatsnew #close').click(function() {
		localStorage['whatsnew-v' + version] = 'clicked';
		$('#whatsnew-wrapper').hide();
	});
	
	/* CLICK EVENTS */

	$('body').click(function() {
		$('#note-list').hide();
		$('#note-count').removeClass('showlist');
		$('#settings-container').hide();
		$('#settings-icon').removeClass('showsettings');
	}).height($('body').height() - $('#gb').height() - 1).css('background-image', localStorage.getItem('body-sticky'));
	$('#gb').dblclick(function(event) {
		event.stopPropagation();
		return false;
	});
	
	$('.ui-dialog').live('dblclick', function(event) {
		event.stopPropagation();
	});
	
	if (localStorage.getItem('grid-view-sticky') && localStorage.getItem('grid-view-sticky') == 'true') {
		$('#grid-view').addClass('set');
	}
	
	calcNoteCount();
	
	$('#note-count').click(function() {
		event.stopPropagation();
		$('#settings-container').hide();
		$('#settings-icon').removeClass('showsettings');
		
		openNoteList();
	});
	
	
	$('#note-list ul li').live({
		click:
			function() {
				var largestZ = 1; 
				$('.sticky').each(function(i) {
					var currentZ = parseFloat($(this).css('z-index'));
					largestZ = currentZ > largestZ ? currentZ : largestZ;
				});
				$('#' + $(this).attr('class')).css('z-index', largestZ + 1)

				$('#' + $(this).attr('class') + ' .sticky-content').focus();
			},
		mouseenter:
			function() {
				$('#' + $(this).attr('class')).addClass('specialhover');
			},
		mouseleave:
			function() {
				$('#' + $(this).attr('class')).removeClass('specialhover');
			}
		}
	);
	
	$('#note-list ul li span.ui-icon-close').live('click', function() {
		var id = $(this).parent().attr('class');

		if (localStorage['delete-prompt-skip'] != 'true') {
			$('#delete-dialog').attr('rel', id).dialog({ position : 'center' }).dialog('open');
		} else {
			deleteNote(id);
		}
		
		if (getNoteCount() != '0') {
			openNoteList();
		}
	});
	
	$('#settings-icon').click(function(event) {
		event.stopPropagation();
		$('#note-list').hide();
		$('#note-count').removeClass('showlist');
		
		$(this).toggleClass('showsettings');
		$('#settings-container').toggle();
	});
	$('#add-sticky').click(function() {
		$('body').dblclick();
	});
	$('#grid-view').click(function() {
		$(this).toggleClass('set');
		if ($(this).hasClass('set')) {
			localStorage.setItem('grid-view-sticky', 'true');
			$('.sticky').addClass('grid');
		} else {
			localStorage.setItem('grid-view-sticky', 'false');
			$('.sticky').each(function() {
				$(this).removeClass('grid');

				$(this).css({
					top	: JSON.parse(localStorage.getItem('sticky-' + $(this).attr('id'))).top,
					left	: JSON.parse(localStorage.getItem('sticky-' + $(this).attr('id'))).left
				});
			});
		}
	});
	$('#settings').click(function() {
		location = 'options.html';
	});
	$('#delete-all').click(function() {
		$('#delete-all-dialog').dialog('open');
	});
	
	/* DIALOGS */
	
	$('#options-dialog').dialog({
		modal		: true,
		autoOpen	: false,
		resizable	: false,
		width		: 700,
		buttons		: { 'Okay' : function() { $(this).dialog('close'); } }
	});
	$('#delete-dialog').dialog({
		modal		: true,
		autoOpen	: false,
		resizable	: false,
		buttons		: {
					'Yes'	: function() {
						deleteNote($(this).attr('rel'));
						$(this).dialog('close');
					},
					'No'	: function() {
						$(this).dialog('close');
					}
				  }
	});
	$('#delete-all-dialog').dialog({
		modal		: true,
		autoOpen	: false,
		resizable	: false,
		buttons		: {
					'Yes'	: function() {
						$('.sticky').each(function() {
							deleteNote($(this).attr('id'));
						});
						$(this).dialog('close');
					},
					'No'	: function() {
						$(this).dialog('close');
					}
				  }
	});
	
	/* OPTIONS */
	
	$('ul#options-notecolor li').click(function() {
		var $this = $(this), id = $(this).parents('#options-dialog').attr('rel');
		$this.addClass('selected').siblings().removeClass('selected');
		$('#' + id).css('backgroundColor', $this.css('background-color'));
		saveNote(id);
	});
	
	$('#options-fontface')
	.selectmenu({
		style	: 'dropdown',
		width	: 430,
		maxHeight: 250
	})
	.change(function() {
		var $this = $(this), id = $(this).parents('#options-dialog').attr('rel'), font = this.value;
		$('#' + id).find('.sticky-content').css('font-family', font);
		saveNote(id);
	});
	
	$('#options-fontsize').spinner({
		min : 1,
		max : 100,
		allowNull : false
	}).width(35).change(function() {
		var $this = $(this), id = $(this).parents('#options-dialog').attr('rel');
		$('#' + id).children('.sticky-content').css('font-size', $this.val() + 'px');
		saveNote(id);
	});
	
	$('.ui-selectmenu-menu').jScrollPane({
		verticalGutter: 5
	});
});

function saveNote(id) {
	var sticky = $('#' + id);
	obj = JSON.parse(localStorage.getItem('sticky-' + sticky.attr('id')));

	if (obj != null) {
		// update
		obj.id		= sticky.attr('id');
		obj.title	= sticky.find('h1.sticky-title').html();
		obj.text	= sticky.find('.sticky-content').html();
		obj.notecolor	= sticky.css('background-color');
		obj.font	= sticky.find('.sticky-content').css('font-family');
		obj.fontsize	= sticky.find('.sticky-content').css('font-size');
		obj.width	= sticky.css('width');

		if (sticky.hasClass('collapse')) {
			obj.collapse = 'collapse';
		} else {
			obj.collapse = '';
		}

		if (!sticky.hasClass('grid')) {
			obj.top		= sticky.css('top');
			obj.left	= sticky.css('left');
		}

	} else {
		// new
		obj = {
			id		: sticky.attr('id'),
			top		: sticky.css('top'),
			left		: sticky.css('left'),
			title		: sticky.find('h1.sticky-title').html(),
			text		: sticky.find('.sticky-content').html(),
			notecolor	: sticky.css('background-color'),
			font		: sticky.find('.sticky-content').css('font-family'),
			fontsize	: sticky.find('.sticky-content').css('font-size'),
			width		: sticky.css('width'),
			collapse	: ''
		};
	}

	localStorage.setItem('sticky-' + obj.id, JSON.stringify(obj));
	calcNoteCount();
}

function deleteNote(id) {
	localStorage.removeItem('sticky-' + id);
	$('#' + id).fadeOut(200, function () {
		$(this).remove();
		calcNoteCount();
	});
}

function calcNoteCount() {
	$('#note-count span').html(getNoteCount());
}

function getNoteCount() {
	var noteCount = 0;
	for (var i = 0; i < localStorage.length; i++) {
			if (localStorage.key(i).startsWith('sticky-')) {
				noteCount++;
			}
	}
	
	return noteCount;
}

function openNoteList() {
	var $notecount = $('#note-count');
	if ($notecount.text() != '0') {
		if (!$notecount.hasClass('showlist')) {
			$notecount.addClass('showlist');

			// destroy note list
			$('#note-list ul').remove();

			// build note list
			$('#note-list').append('<ul></ul>');
			for (var i = 0; i < localStorage.length; i++) {
				if (localStorage.key(i).startsWith('sticky-')) {
					var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
					$('#note-list ul').append('<li class="' + obj.id + '">' + obj.title + '<span class="ui-icon ui-icon-close"></span></li>');
				}
			}

			$('#note-list').show(0, function() {
				$('#note-list ul').jScrollPane({
					verticalGutter : 5
				});
			});
		} else {
			$notecount.removeClass('showlist');
			$('#note-list').hide();
		}
	}
}

var LIVE_STICKIES = (function () {
	var initStickies = function initStickies() {
		$('body').live({
			'click'		: function() { $('.context-menu').hide(); },
			'dblclick'	: function(event) {
					  	TOP = event.pageY;
						LEFT = event.pageX;
						createSticky();
					  }
		});
		
		initStickies = null;
	},
	openStickies = function openStickies() {
		initStickies && initStickies();
		for (var i = 0; i < localStorage.length; i++) {
			if (localStorage.key(i).startsWith('sticky-')) {
				createSticky(JSON.parse(localStorage.getItem(localStorage.key(i))));
			}
		}
	},
	createSticky = function createSticky(data) {
		data = data || {
			id		: + new Date(),
			top 		: TOP + 'px',
			left		: LEFT + 'px',
			title		: 'Note',
			text		: '',
			notecolor	: '#ffc',
			font		: 'Helvetica,\'Helvetica Nueue\'',
			fontsize	: 16,
			width		: 200,
			collapse	: ''
		};

		var $sticky = $('<div />', {
				'class'	: 'sticky ' + data.collapse,
				'id'	: data.id
			})
			.append($('<div />', {
				'class'	: 'ui-icon ui-icon-minus',
				'title'	: 'Collapse/Expand Note',
				click	: function() {
					$(this).parents('.sticky').toggleClass('collapse').show(0, saveSticky);
				}
			}))
			.append($('<div />', {
				'class'	: 'ui-icon ui-icon-wrench',
				'title'	: 'Configure Note',
				click	: function() {
					var $this = $(this), largestZ = 1; 
					$('.sticky').each(function(i) {
						var currentZ = parseFloat($(this).css('z-index'));
						largestZ = currentZ > largestZ ? currentZ : largestZ;
					});
					$(this).parents('.sticky').css("z-index", largestZ + 1);
					
					$('ul#options-notecolor li').each(function() {
						var $li = $(this);
						if ($this.parents('.sticky').css('background-color') == $li.css('background-color')) {
							$li.addClass('selected').siblings().removeClass('selected');
						}
					});
					
					$('select#options-fontface').val($this.parents('.sticky').find('.sticky-content').css('font-family'));
					
					var selectedFont = $('#options-fontface-button .ui-selectmenu-status').html();
					$('#options-fontface option').each(function() {
						if (this.selected) {
							selectedFont = $(this).html();
						}
					});
					$('#options-fontface-button .ui-selectmenu-status').html(selectedFont);
					
					$('input#options-fontsize').val(parseInt($this.parents('.sticky').find('.sticky-content').css('font-size')));
					
					$('#options-dialog').attr('rel', $this.parents('.sticky').attr('id')).dialog({ position : 'center' }).dialog('open');
				}
			}))
			.append($('<div />', {
				'class'	: 'ui-icon ui-icon-trash',
				'title'	: 'Delete Note',
				click	: function () {
					var $this = $(this), largestZ = 1; 
					$('.sticky').each(function(i) {
						var currentZ = parseFloat($(this).css('z-index'));
						largestZ = currentZ > largestZ ? currentZ : largestZ;
					});
					$this.parents('.sticky').css("z-index", largestZ + 1);
					
					if (localStorage['delete-prompt-skip'] != 'true') {
						$('#delete-dialog').attr('rel', $this.parents('.sticky').attr('id')).dialog({ position : 'center' }).dialog('open');
					} else {
						deleteNote($this.parents('.sticky').attr('id'));
					}
				}
			}))
			.append($('<h1 />', {
				'class' : 'sticky-title',
				html	: data.title,
				keyup	: saveSticky,
				'title'	: 'Double-click to edit title'
			})
			.bind('dblclick', function() {
				$('.context-menu').hide();
				$(this).addClass('edit').attr('contenteditable', 'true').focus();
			})
			.blur(function() {
				$(this).removeClass('edit').attr('contenteditable', 'false');
			})
			)
			.append($('<div />', {
					'class' 	: 'sticky-content',
					html		: data.text,
					contentEditable	: true,
					keyup		: saveSticky
				})
				.css({
					'font-family'	: data.font,
					'font-size'	: data.fontsize,
					'color'		: data.textcolor,
				})
				.click(function() {
					var largestZ = 1; 
					$('.sticky').each(function(i) {
						var currentZ = parseFloat($(this).css('z-index'));
						largestZ = currentZ > largestZ ? currentZ : largestZ;
					});
					$(this).parents('.sticky').css("z-index", largestZ + 1);
				})
			)
			.resizable({
				minWidth	: 200,
				minHeight	: 200,
				handles		: 'e,w',
				containment	: 'body',
				stop		: saveSticky
			})
			.draggable({
				handle		: '.sticky h1',
				stack		: '.sticky',
				stop		: saveSticky,
				containment	: 'body',
				cancel		: '.sticky-content, .button, .settings, h1.edit, .grid, .ui-icon',
				distance	: 0
			})
			.bind({
				dblclick	: function(event) {
						  	event.stopPropagation();
						  }
			})
			.css({
				position		: 'absolute',
				'top'			: data.top,
				'left'			: data.left,
				'display'		: 'none',
				'background-color'	: data.notecolor,
				'width'			: data.width
			})
			.appendTo(document.body)
			.fadeIn(200, saveSticky);
		
		if (localStorage.getItem('grid-view-sticky') && localStorage.getItem('grid-view-sticky') == 'true') {
			$sticky.addClass('grid');
		}
		
		return $sticky;
	},
	saveSticky = function saveSticky() {
		var $this = $(this), sticky = ($this.hasClass('sticky-title') || $this.hasClass('sticky-content') || $this.hasClass('slider')) ? $this.parents('div.sticky'): $this;
		saveNote(sticky.attr('id'));
	}
	
	return {
		open	: openStickies,
		init	: initStickies,
		'new'	: createSticky
	};
}());
