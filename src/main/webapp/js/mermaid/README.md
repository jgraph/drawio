# To change mermaid.min.js for IE11

1. Clone Mermaid source from Github
1. Change the file `webpack.config.base.js`. Look for `const jsRule = {` and replace that block with

```
const jsRule = {
  test: /\.js$/,
  include: [
    path.resolve(__dirname, './src'),
    path.resolve(__dirname, './node_modules/dagre-d3-renderer/lib'),
    path.resolve(__dirname, './node_modules/crypto-random-string'),
    path.resolve(__dirname, './node_modules/@braintree/sanitize-url'),
    path.resolve(__dirname, './node_modules/dagre'),
    path.resolve(__dirname, './node_modules/graphlib'),
    path.resolve(__dirname, './node_modules/he'),
    path.resolve(__dirname, './node_modules/scope-css')
  ],
  use: {
    loader: 'babel-loader'
  }
};
```

The idea is to add any library used in package.json that is not compatible with IE11