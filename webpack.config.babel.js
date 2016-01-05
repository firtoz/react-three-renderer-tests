import path from 'path';

const isCoverage = process.env.KARMA_COVERAGE === 'true';

export default {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        loader: path.join(__dirname, 'node_modules', 'babel-loader'),
        exclude: [
          /node_modules/,
          path.join(__dirname, '..', 'lib'),
        ],
        test: /\.js$/,
        query: {},
      },
    ],
    postLoaders: isCoverage ? [{
      test: /.js/,
      exclude: /test|node_modules/,
      loader: path.join(__dirname, 'node_modules', 'istanbul-instrumenter-loader'),
    }] : [],
    resolve: {
      root: __dirname,
      extensions: ['', '.js', '.jsx'],
    },
  },
  devServer: {
    stats: {
      colors: true,
    },
  },
};
