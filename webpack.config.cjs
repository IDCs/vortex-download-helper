let webpack = require("vortex-api/bin/webpack").default;
module.exports = {
  ...webpack("index", __dirname, 5),
  output: {
    filename: 'downloader.js',
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader', options: { allowTsInNodeModules: true } }],
  },
}
