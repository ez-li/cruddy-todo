const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
Promise.promisifyAll(fs);

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



// exports.readAll = function() {
//   var files = [];
//   for (var i = 0; i < 100; ++i) {
//       files.push(fs.writeFileAsync("file-" + i + ".txt", "", "utf-8"));
//   }
//   Promise.all(files).then(function() {
//       // object with individual id and text for each file;
//   });

// }
exports.readAll = function(callback) {
  return fs.readdirAsync(exports.dataDir)
    .then((files) => {
      var promises = _.map(files, (file) => {
        return fs.readFileAsync(`${exports.dataDir}/${file}`, 'utf8')
          .then((text) => {
            file = file.slice(0,5);
            var obj = {id: file, text: text};
            console.log(obj);
            return obj;
          })
      })
      return promises;
    })
    .then((promiseArray)=> {
      console.log('hi', promiseArray);
      // callback(Promise.all(promiseArray));
      return Promise.all(promiseArray)
    })
    .then((output) => {
      return callback(null, output);
    })
}

// return fs.readdirAsync(exports.dataDir)
//   .then(function(files) {
//      var output = _.map(files, (value) => {
//       var id = value.slice(0,5);
//       return id;
//     })
//     return output;
//   })
//   .then(function(output) {
//     var idArray = _.map(output, (id) => {
//       fs.readFileAsync(`${exports.dataDir}/${id}.txt`)
//         return {
//           id: id,
//           text: data
//         }
//     })
//     return idArray
//   })
//   .then(function)
// .then readFile (filepath with the filename / id)
// input is the id

// exports.readAll = (callback) => {
//   fs.readdir(exports.dataDir, (err, files) => {
//     var outPut = _.map(files, (value) => {
//         return {
//           id: value.slice(0,5),
//           text: value.slice(0,5)
//         }
//     })
//     callback(null, outPut);
//   });

// };

// var readAllAsync = Promise.promisify(exports.readAll);

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
