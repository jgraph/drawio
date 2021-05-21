# To change mermaid.min.js for IE11

1. Clone Mermaid source from Github
1. Change the file `webpack.config.base.js`. Look for `const jsRule = {` and replace that block with

```
const jsRule = {
  test: /\.js$/,
  include: [
    path.resolve(__dirname, './src'),
    path.resolve(__dirname, './node_modules/dagre-d3-renderer/lib'),
    path.resolve(__dirname, './node_modules/@braintree/sanitize-url'),
    path.resolve(__dirname, './node_modules/dagre'),
    path.resolve(__dirname, './node_modules/graphlib'),
    path.resolve(__dirname, './node_modules/he'),
    path.resolve(__dirname, './node_modules/entity-decode'),
    path.resolve(__dirname, './node_modules/khroma/dist'),
    path.resolve(__dirname, './node_modules/stylis')
  ],
  use: {
    loader: 'babel-loader'
  }
};
```

The idea is to add any library used in package.json that is not compatible with IE11
Then polyfill any JS error in IE11 (e.g, version 8.10.1 needs Number.isInteger polyfill such that js loads without errors)

All trials to polyfill other errors failed (using useBuiltIns: 'usage', corejs: {version: '2.0'} or polyfill.io). IE11 has basic support for flowchart, sequence and er only