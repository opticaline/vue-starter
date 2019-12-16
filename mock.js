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

function noCache(module) {
    fs.watchFile(path.resolve(module), () => {
        delete require.cache[require.resolve(module)]
    })
}

const register = function (app, dir, file) {
    var tmp = file.replace(dir, "").split(".");
    var p = tmp.slice(0, tmp.length - 1).join(".");
    if (process.platform == 'win32') {
        p = p.replace(/\\/g, '/');
    }
    var suffix = tmp[tmp.length - 1];
    switch (suffix.toLowerCase()) {
        case "json":
            noCache(file);
            app.all(p, (req, res) => {
                res.json(require(file));
            });
            break;
        case "js":
            noCache(file);
            app.all(p, (req, res) => {
                const mock = require(file);
                mock.handle(req, res);
            });
            break;
        case "jpg":
        case "jfif":
        case "png":
            noCache(file);
            app.all(encodeURI(`${p}.${suffix}`), (req, res) => {
                var stat = fs.statSync(file);

                res.writeHead(200, {
                    'Content-Type': suffix.toLowerCase() == 'png' ? 'image/png' : 'image/jpeg',
                    'Content-Length': stat.size
                });

                var readStream = fs.createReadStream(file);
                readStream.pipe(res);
            });
            break;
        default:
            console.log(`${p}`);
    }
}

module.exports = {
    init: function (app, config) {
        var dir = path.join(__dirname, config.directories);

        walkDir(dir).forEach(function (file) {
            register(app, dir, file);
        });
    }
}