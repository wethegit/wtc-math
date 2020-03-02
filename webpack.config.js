const path = require('path');

module.exports = {
  target: 'web',
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'wtc-math.es5.js',
    library: 'WTCMath'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: {
          presets: [["@babel/env", {
            "targets": {
              "browsers": ["last 2 versions", "ie > 11"]
            },
            useBuiltIns: "usage",
            corejs: 3,
          }]]
        }
      }
    ]
  }
}