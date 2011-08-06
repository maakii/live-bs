String.prototype.startsWith = function(str){
   return (this.indexOf(str) === 0);
}

$(document).ready(function() {
   $('#html5').fadeIn(200);
   $('a#html5link').hover(function() {
       $(this).width(197);
       $('#elems').animate({ width : 190 }, 200);
   }, function() {
       $(this).width(64);
       $('#elems').animate({ width : 1 }, 200);
   });

   $('body').attr('class', localStorage.getItem('body-sticky') ?
   localStorage.getItem('body-sticky') : 'wood');
});

var TOP = 0;
var LEFT = 0;
var STICKIES = (function () {
   var initStickies = function initStickies() {
       $(document).bind({
           'click'     : function() { $('.context-menu').hide(); },
           'dblclick'  : function(event) {
                       TOP = event.pageY;
                       LEFT = event.pageX;
                       createSticky();
                     }
       });
       $('<div />', {
           text : "+",
           'id' : 'add-sticky',
           click : function () {
                   TOP = 0;
                   LEFT = 0;
                   createSticky();
               }
       }).appendTo(document.body);
       $('<div />', {
           text : '+',
           'id' : 'grid-view',
           click : function () {
                   $(this).toggleClass('set');
                   if ($(this).hasClass('set')) {
                       localStorage.setItem('grid-view-sticky', 'true');
                       $('.sticky').addClass('grid');
                   } else {
                       localStorage.setItem('grid-view-sticky', 'false');
                       $('.sticky').each(function() {
                           $(this).removeClass('grid');

                           $(this).css({
                               top :
JSON.parse(localStorage.getItem('sticky-' + $(this).attr('id'))).top,
                               left    :
JSON.parse(localStorage.getItem('sticky-' + $(this).attr('id'))).left
                           });
                       });
                   }
               }
       }).appendTo(document.body);

       $('<div />', {
           text : '+',
           'id' : 'bg-change',
           click : function () {
                   $('body').toggleClass('wood cork');
                   localStorage.setItem('body-sticky',
$('body').attr('class'));
               }
       }).appendTo(document.body);

       $('<div />', { id : 'elems' }).appendTo(document.body);
       $('<div />', { id : 'html5' }).appendTo(document.body);
       $('<a />', {
           id  : 'html5link',
           href    : 'http://www.w3.org/html/logo/',
           target  : '_blank'
       }).appendTo(document.body);
       $('<a />', {
           id  : 'builtby',
           html    : 'built by @wavetree',
           href    : 'http://www.twitter.com/wavetree',
           target  : '_blank'
       }).appendTo(document.body);
       if (localStorage.getItem('grid-view-sticky') &&
localStorage.getItem('grid-view-sticky') == 'true') {
           $('#grid-view').addClass('set');
       }
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
           id      : + new Date(),
           top         : TOP + 'px',
           left        : LEFT + 'px',
           title       : 'New Note',
           text        : 'Click to edit',
           notecolor   : '#ffc',
           fontsize    : 16,
           width       : 200
       }

       var $sticky = $('<div />', {
               'class' : 'sticky',
               'id'    : data.id
           })
           .append($('<div />', {
               'class' : 'ui-icon ui-icon-wrench',
               'title' : 'Configure Note',
               click   : function() {
                   var largestZ = 1;
                   $('.sticky').each(function(i) {
                       var currentZ = parseFloat($(this).css('z-index'));
                       largestZ = currentZ > largestZ ? currentZ : largestZ;
                   });
                   $(this).parents('.sticky').css("z-index", largestZ + 1);

$(this).parents('.sticky').children('.delete').slideUp(200).siblings('.settings').slideDown(200);
               }
           }))
           .append($('<div />', {
               'class' : 'ui-icon ui-icon-trash',
               'title' : 'Delete Note',
               click   : function () {
                   var largestZ = 1;
                   $('.sticky').each(function(i) {
                       var currentZ = parseFloat($(this).css('z-index'));
                       largestZ = currentZ > largestZ ? currentZ : largestZ;
                   });
                   $(this).parents('.sticky').css("z-index", largestZ + 1);

$(this).parents('.sticky').children('.settings').slideUp(200).siblings('.delete').slideDown(200);
               }
           }))
           .append($('<h1 />', {
               'class' : 'sticky-title',
               html    : data.title,
               keyup   : saveSticky,
               'title' : 'Double-click to edit title'
           })
           .bind('dblclick', function() {
               $('.context-menu').hide();
               $(this).addClass('edit').attr('contenteditable',
'true').focus();
           })
           .blur(function() {
               $(this).removeClass('edit').attr('contenteditable', 'false');
           })
           )
           .append($('<div />', {
                   'class'     : 'sticky-content',
                   html        : data.text,
                   contentEditable : true,
                   keyup       : saveSticky
               })
               .css({
                   'font-family'   : data.font,
                   'font-size' : data.fontsize,
                   'color'     : data.textcolor,
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
           .append($('<div />', { 'class' : 'settings' })
               .append($('<p />',{
                   'class' : 'color',
                   html    : 'Note color'
               }))
               .append($('<ul />', { 'class' : 'color' })
                   .append($('<li />', { html : 'Default', 'class' :
'default', click : function() { var $this = $(this);
$(this).parents('.sticky').animate({'background-color' :
$this.css('background-color')}, 200, saveSticky); } }))
                   .append($('<li />', { html : 'Red', 'class' :
'red', click : function() { var $this = $(this);
$(this).parents('.sticky').animate({'background-color' :
$this.css('background-color')}, 200, saveSticky); } }))
                   .append($('<li />', { html : 'Orange', 'class' :
'orange', click : function() { var $this = $(this);
$(this).parents('.sticky').animate({'background-color' :
$this.css('background-color')}, saveSticky); } }))
                   .append($('<li />', { html : 'Yellow', 'class' :
'yellow', click : function() { var $this = $(this);
$(this).parents('.sticky').animate({'background-color' :
$this.css('background-color')}, saveSticky); } }))
                   .append($('<li />', { html : 'Green', 'class' :
'green', click : function() { var $this = $(this);
$(this).parents('.sticky').animate({'background-color' :
$this.css('background-color')}, saveSticky); } }))
                   .append($('<li />', { html : 'Blue', 'class' :
'blue', click : function() { var $this = $(this);
$(this).parents('.sticky').animate({'background-color' :
$this.css('background-color')}, saveSticky); } }))
                   .append($('<li />', { html : 'Purple', 'class' :
'purple', click : function() { var $this = $(this);
$(this).parents('.sticky').animate({'background-color' :
$this.css('background-color')}, saveSticky); } }))
                   .append($('<li />', { html : 'Gray', 'class' :
'gray', click : function() { var $this = $(this);
$(this).parents('.sticky').animate({'background-color' :
$this.css('background-color')}, saveSticky); } }))
               )
               .append($('<p />', { 'class' : 'fontsize', html :
'Font size: ' })
                   .append($('<span />', {
                       'class' : 'sliderval'
                       // html : parseInt(data.fontsize)
                   }))
                   .append($('<div />', { 'class' : 'slider' })
                       .slider({
                           animate : 200,
                           min : 10,
                           max : 30,
                           value   : parseInt(data.fontsize),
                           start   : function() {
                                   var largestZ = 1;
                                   $('.sticky').each(function(i) {
                                       var currentZ =
parseFloat($(this).css('z-index'));
                                       largestZ = currentZ > largestZ
? currentZ : largestZ;
                                   });

$(this).parents('.sticky').css("z-index", largestZ + 1);
                                 },
                           slide   : function(event, ui) {
                                   var largestZ = 1;
                                   $('.sticky').each(function(i) {
                                       var currentZ =
parseFloat($(this).css('z-index'));
                                       largestZ = currentZ > largestZ
? currentZ : largestZ;
                                   });

$(this).parents('.sticky').css("z-index", largestZ + 1);

$(this).parents('.sticky').find('.sticky-content').css('font-size',
ui.value + 'px');
                                 },
                           stop    : saveSticky
                       })
                   )
               )
               .append($('<p />', { 'class' : 'button' }).append($('<a />', {
                   html    : 'Done',
                   class   : 'center',
                   click   : function() {
$(this).parents('.settings').slideUp(200); }
               }))
               )
               .click(function() {
                   var largestZ = 1;
                   $('.sticky').each(function(i) {
                       var currentZ = parseFloat($(this).css('z-index'));
                       largestZ = currentZ > largestZ ? currentZ : largestZ;
                   });
                   $(this).parents('.sticky').css("z-index", largestZ + 1);
               })
           )
           .append($('<div />', {'class' : 'delete' })
               .append($('<p />', { 'class' : 'button', html : 'Are
you sure you want to delete this note?' }))
               .append($('<p />', { 'class' : 'button' })
                   .append($('<a />', {
                       html    : 'Yes',
                       click   : function() {
                               var id = $(this).parents('.sticky').attr('id');
                               localStorage.removeItem('sticky-' + id);
                               $('#' + id).fadeOut(200, function() {
$(this).remove(); });
                             }
                   }))
                   .append($('<a />', {
                       html    : 'No',
                       class   : 'right',
                       click   : function() {
                               var largestZ = 1;
                               $('.sticky').each(function(i) {
                                   var currentZ =
parseFloat($(this).css('z-index'));
                                   largestZ = currentZ > largestZ ?
currentZ : largestZ;
                               });

$(this).parents('.sticky').css("z-index", largestZ + 1);
                               $(this).parents('.delete').slideUp(200);
                             }
                   }))
               )
           )
           .resizable({
               minWidth    : 200,
               minHeight   : 200,
               handles     : 'e,w',
               containment : 'body',
               start       : function(e, ui) { console.debug($(e.target)); },
               stop        : saveSticky
           })
           .draggable({
               handle      : '.sticky h1',
               stack       : '.sticky',
               stop        : saveSticky,
               containment : 'body',
               cancel      : '.sticky-content, .button, .settings,
h1.edit, .grid, .ui-icon',
               distance    : 0
           })
           .bind({
               dblclick    : function(event) {
                           event.stopPropagation();
                         }
           })
           .css({
               position        : 'absolute',
               'top'           : data.top,
               'left'          : data.left,
               'display'       : 'none',
               'background-color'  : data.notecolor,
               'width'         : data.width
           })
           .appendTo(document.body)
           .fadeIn(200, saveSticky);

       if ($('#grid-view').hasClass('set')) {
           $sticky.addClass('grid');
       }

       return $sticky;
   },
   deleteSticky = function deleteSticky(id) {
       localStorage.removeItem('sticky-' + id);
       $('#' + id).fadeOut(200, function () { $(this).remove(); });
   },
   saveSticky = function saveSticky() {
       var $this = $(this),
           sticky = ($this.hasClass('sticky-title') ||
$this.hasClass('sticky-content') || $this.hasClass('slider')) ?
$this.parents('div.sticky'): $this,
           obj = JSON.parse(localStorage.getItem('sticky-' +
sticky.attr('id')));

       if (obj != null) {
           // update
           obj.id      = sticky.attr('id');
           obj.title   = sticky.find('h1.sticky-title').html();
           obj.text    = sticky.find('.sticky-content').html();
           obj.notecolor   = sticky.css('background-color');
           obj.fontsize    = sticky.find('.sticky-content').css('font-size');
           obj.width   = sticky.css('width');

           if (!sticky.hasClass('grid')) {
               obj.top     = sticky.css('top');
               obj.left    = sticky.css('left');
           }

       } else {
           // new
           obj = {
               id      : sticky.attr('id'),
               top     : sticky.css('top'),
               left        : sticky.css('left'),
               title       : sticky.find('h1.sticky-title').html(),
               text        : sticky.find('.sticky-content').html(),
               notecolor   : sticky.css('background-color'),
               fontsize    : sticky.find('.sticky-content').css('font-size'),
               width       : sticky.css('width')
           };
       }

       localStorage.setItem('sticky-' + obj.id, JSON.stringify(obj));
   }

   return {
       open    : openStickies,
       init    : initStickies,
       'new'   : createSticky,
       remove  : deleteSticky
   };
}());
