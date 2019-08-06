const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

exports.items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    // var filePath = path.join(exports.dataDir, data + '.txt');
    var filePath = `${exports.dataDir}/${data}.txt`
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        exports.items[data] = {};
        exports.items[data].id = data;
        exports.items[data].text = text;
        callback(null, exports.items[data]);
      }
    })
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var outPut = _.map(files, (value) => {
        return {
          id:value.slice(0,5),
          text:value.slice(0,5)
        }
    })
    callback(null, outPut);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err,fileData) => {
    if(err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {
        id:id,
        text:fileData.toString() });
      console.log(fileData.toString())
    }
  } )
};
exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if(err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if(err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if(err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        if(err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback();
        }
      })
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
