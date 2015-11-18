import path from 'path';

const isCoverage = process.env.KARMA_COVERAGE === 'true';


// const pluginsWithoutUglify = [
//   new webpack.DefinePlugin({
//     'process.env': {
//       'NODE_ENV': '"production"',
//     },
//   }),
//   new webpack.optimize.CommonsChunkPlugin(path.join('js', 'bundle-commons.js'), ['app', 'advanced']),
// ];
//
// const plugins = pluginsWithoutUglify.concat([
//   new webpack.optimize.UglifyJsPlugin({
//     compress: {
//       warnings: false,
//     },
//     mangle: true,
//   }),
// ]);

export default {
  //entry: [
  //  'mocha!./src/core/React3-test.js',
  //],
  //output: {
  //  path: outPath,
  //  filename: 'bundle.js',
  //},
  devtool: 'source-map',
  'module': {
    'loaders': [
      {
        loader: path.join(__dirname, 'node_modules', 'babel-loader'),
        exclude: [
          /node_modules/,
          path.join(__dirname, '..', 'lib'),
        ],
        test: /\.js$/,
        query: {
          // 'presets': ['es2015'],
          //  optional: ['runtime'],
          //  cacheDirectory: true,
          //  stage: 0,
        },
      },
    ],
    postLoaders: isCoverage ? [{
      test: /.js/,
      exclude: /test|node_modules/,
      loader: path.join(__dirname, 'node_modules', 'istanbul-instrumenter-loader'),
    }] : [],
    'resolve': {
      'extensions': ['', '.js', '.jsx'],
    },
  },
  devServer: {
    // contentBase: outPath,
    //  noInfo: true, //  --no-info option
    // hot: true,
    // inline: true,
    stats: {colors: true},
  },
  //pluginsWithoutUglify,
  //plugins,
};
