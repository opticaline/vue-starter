const path = require('path');
const fs = require('fs');

var walkDir = function (dir) {
  var result = [];
  fs.readdirSync(dir).forEach(function (file) {
    file = path.resolve(dir, file);
    var stat = fs.statSync(file);
    if (stat.isDirectory()) {
      result.push(...walkDir(file));
    } else {
      result.push(file);
    }
  });
  return result;
}

module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    before(app) {
      var dir = path.join(__dirname, 'mock');
      walkDir(dir).forEach(function (file) {
        var tmp = file.replace(dir, "").split(".");
        var p = tmp.slice(0, tmp.length - 1).join(".");
        if (process.platform == 'win32') {
          p = p.replace(/\\/g, '/');
        }
        switch (tmp[tmp.length - 1]) {
          case "json":
            app.all(p, (req, res) => {
              res.json(require(file));
            });
            break;
          case "js":
            const mock = require(file);
            app.all(p, mock.handle);
            break;
        }
      });
    }
  },
  runtimeCompiler: true
}