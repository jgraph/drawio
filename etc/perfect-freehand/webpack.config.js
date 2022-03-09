const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/freehand.js',
  output: {
    filename: 'perfect-freehand.js',
    path: path.resolve(__dirname, '../../src/main/webapp/js/freehand'),
  },
};