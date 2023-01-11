const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');
const camelCase = require('lodash.camelcase');

dotenv.config();

const libraryName = 'lib-call-quality-monitoring';
// Allowed values in process.env
const allowedEnvVariables = [
  'NODE_ENV',
  'API_KEY',
  'TURN_URI',
  'TURN_USERNAME',
  'TURN_CREDENTIALS',
  'STUN_URI',
  'API_BASE_URL',
  'PUBLIC_URL'
];

const config = {
  entry: {
    [libraryName]: { import: `./src/${libraryName}.ts`, filename: `lib/${libraryName}.js` },
    browser: './src/browser.mjs'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: { name: camelCase(libraryName), type: 'umd' },
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    static: {
      directory: './dist'
    },
    hot: true,
    server: 'https',
  },
  devtool: 'source-map',
  plugins: [
    // new webpack.EnvironmentPlugin(allowedEnvVariables), // Doesn't work
    new webpack.DefinePlugin({
      'process.env': Object.keys(process.env)
        .filter(k => allowedEnvVariables.indexOf(k) >= 0)
        .map(k => ({ [k]: JSON.stringify(process.env[k]) }))
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/index.html' }]
    }),
    new LodashModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  optimization: {
    nodeEnv: false
  }
};

module.exports = (env, argv) => {
  if (argv.hot) {
    // Cannot use 'contenthash' when hot reloading is enabled.
    config.output.filename = '[name].[hash].js';
  }

  return config;
};
