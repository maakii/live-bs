var async = require("async");

async.parallel([
  function(callback) {
    console.log("1");
    callback(null,'1');
  },
  function(callback) {
    console.log("2");
    callback(null,'2');
  },
  function(callback) {
    console.log("3");
    callback(null,'3');
  },
  function(callback) {
    console.log("4");
    callback(null,'4');
  }

  ], function(err, results) {
    if (err) {
      console.log(err);
    }
    console.log(results);
  });


