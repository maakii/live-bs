/*
 * Make a sticky alive: 
 *   build the connection to the server on each sticky.
 *   keep the latest with the server by updating content.
 */

var socket = io.connect(hosturl);
socket.json.send(
    {"type": "REQ",
     "ver" : 1,
     "contents": "test message"
    }
);
socket.on('message', function(data) {
  console.log("data=" + JSON.stringify(data));
});

// No used below
var new_sticky = null;
function sticky_create_bind(callback) {
  new_sticky = callback;
};

function sticky_updated(obj) {
  // if not existed, newly create
  var div = $('#' + obj.id);
  if (div.size() > 0) {
    // I created the sticky
    obj = {
          id      : div.attr('id'),
          top     : div.css('top'),
          left    : div.css('left'),
          title   : div.find('h1.sticky-title').html(),
          text    : div.find('.sticky-content').html(),
          notecolor	: div.css('background-color'),
          font    : div.find('.sticky-content').css('font-family'),
          fontsize : div.find('.sticky-content').css('font-size'),
          width : div.css('width'),
          collapse : ''
    };

    /* content update */
    var content_prev = JSON.stringify(obj);
    var update = function() {
        obj = {
            id      : div.attr('id'),
            top     : div.css('top'),
            left    : div.css('left'),
            title   : div.find('h1.sticky-title').html(),
            text    : div.find('.sticky-content').html(),
            notecolor	: div.css('background-color'),
            font    : div.find('.sticky-content').css('font-family'),
            fontsize : div.find('.sticky-content').css('font-size'),
            width : div.css('width'),
            collapse : ''
        };
        var content = JSON.stringify(obj);
        if (content_prev != content) {
            message.emit('update', {'obj': obj });
            content_prev = content;
        }
        timer = setTimeout(update, 100);
    };
    update();
  } else {
    // Someone created the sticky
    new_sticky(obj);
  };

};

//var message = io.connect(hosturl + "/message");"
var message = io.connect(hosturl);

message.on('a message', function(data) {
  console.log("data.msg=" + data.msg);
});

message.on('created', function(data) {
  var obj = data.obj;
  console.log("create obj:" + obj.id);

  //sticky_updated(obj);

  var div = $('#' + obj.id);
  if (div.size() > 0) {
    // I created the sticky
    obj = {
          id      : div.attr('id'),
          top     : div.css('top'),
          left    : div.css('left'),
          title   : div.find('h1.sticky-title').html(),
          text    : div.find('.sticky-content').html(),
          notecolor	: div.css('background-color'),
          font    : div.find('.sticky-content').css('font-family'),
          fontsize : div.find('.sticky-content').css('font-size'),
          width : div.css('width'),
          collapse : ''
    };

    /* content update */
    var content_prev = JSON.stringify(obj);
    var update = function() {
        obj = {
            id      : div.attr('id'),
            top     : div.css('top'),
            left    : div.css('left'),
            title   : div.find('h1.sticky-title').html(),
            text    : div.find('.sticky-content').html(),
            notecolor	: div.css('background-color'),
            font    : div.find('.sticky-content').css('font-family'),
            fontsize : div.find('.sticky-content').css('font-size'),
            width : div.css('width'),
            collapse : ''
        };
        var content = JSON.stringify(obj);
        if (content_prev != content) {
            message.emit('update', {'obj': obj });
            content_prev = content;
        }
        timer = setTimeout(update, 100);
    };
    update();
  } else {
    // Someone created the sticky
    new_sticky(obj);
  };
});

function sticky_create(id) {
  var div = $('#' + id);
  var content = div.find('.sticky-content').html();
  var obj = {
          id      : div.attr('id'),
          top     : div.css('top'),
          left    : div.css('left'),
          title   : div.find('h1.sticky-title').html(),
          text    : content,
          notecolor	: div.css('background-color'),
          font    : div.find('.sticky-content').css('font-family'),
          fontsize : div.find('.sticky-content').css('font-size'),
          width : div.css('width'),
          collapse : ''
  };
  message.emit('create', {'obj': obj });
};

message.on('updated', function(data) {
   sticky_updated(data.obj);
});

// function sticky_living(id) {
//   var socket = io.connect(hosturl + "/create");
//   socket.on('connect', function() {

//     /* request the connection by id */
//     socket.emit('created', { "id" : id });
//     console.log('connection requested:' + id);

//     var sticky = io.connect(hosturl + "/sticky/" + id);
//     sticky.on('connect', function() {
//       console.log('connection established:' + id);

//       var div = $('#' + id);
//       var content = div.find('.sticky-content').html();
//       obj = {
//               id      : div.attr('id'),
//               top     : div.css('top'),
//               left    : div.css('left'),
//               title   : div.find('h1.sticky-title').html(),
//               text    : content,
//               notecolor	: div.css('background-color'),
//               font    : div.find('.sticky-content').css('font-family'),
//               fontsize : div.find('.sticky-content').css('font-size'),
//               width : div.css('width'),
//               collapse : ''
//       };

//       /* content update */
//       var content_prev = JSON.stringify(obj);
//       var update = function() {
//           var content = JSON.stringify(obj);
//           if (content_prev != content) {
//               sticky.send(content);
//               console.log('send ' + content);
//               content_prev = content;
//           }
//           timer = setTimeout(update, 100);
//       };
//       update();
//     });
//
// /*
//       var content_prev = div.find('.sticky-content').html();
//       var update = function() {
//           var content = div.find('.sticky-content').html();
//           if (content != undefined) {
//             content = content.replace(/(\n|\r)+/g, "<br>");
//           }
//           if (content_prev != content) {
//               sticky.send(content);
//               console.log('send ' + content);
//               content_prev = content;
//           }
//           timer = setTimeout(update, 100);
//       };
//       update();
//     });
// */

//   });

//   socket.on('disconnect', function(){
//     console.log('disconnect');
//     //cancelTimeout(timer);
//   });
// };
