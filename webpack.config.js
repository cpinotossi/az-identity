var path = require('path');

/**
 * https://webpack.js.org/concepts/configuration/#simple-configuration
 * https://blog.sentry.io/2018/10/18/4-reasons-why-your-source-maps-are-broken
 */
module.exports = {
  mode: 'development',
  entry: './src/storage.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'storage.js',
    sourceMapFilename: "storage.js.map",
    library: 'storageServices'
  },
  devtool: "source-map"
};