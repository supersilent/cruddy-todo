const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  let id;
  counter.getNextUniqueId((error, counter) => {
    fs.writeFile(exports.dataDir + "/" + counter + ".txt", text, err => {
      if (err) {
        throw "error creating todo";
      } else {
        id = counter;
        // items[counter] = text;
        // console.log('counter:',counter);
        callback(null, {
          id,
          text
        });
      }
    });
  });
};

exports.readAll = callback => {
  var data = [];

  fs.readdir(exports.dataDir, (err, files) => {
    // console.log(`this is files`, files)
    for (var i = 0; i < files.length; i++) {
      var id = files[i].split(".")[0];
      // console.log(`this is id`, id);
      data.push({ id: id, text: id });
    }
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  fs.readFile(exports.dataDir + "/" + id + ".txt", "utf8", (err, data) => {
    if (err) {
      return callback(err);
    } else {
      callback(null, {
        id,
        text: data
      });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access(exports.dataDir + "/" + id + ".txt", fs.constants.F_OK, err => {
    if (err) {
      return callback(err);
    } else {
      fs.writeFile(exports.dataDir + "/" + id + ".txt", text, err => {
        if (err) {
          return callback(err);
        } else {
          callback(null, {
            id,
            text
          });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  delete items[id];

  fs.unlink(exports.dataDir + "/" + id + ".txt", (err) =>{
    if (err) {
      return callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
