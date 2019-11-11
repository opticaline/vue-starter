const mock = require('./mock');

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
      mock.init(app, {});
    }
  },
  runtimeCompiler: true
}