const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  target: ['web', 'es5'],
  entry: {
    vanilla: {
      import: './src/library/FaceCheck.ts',
      library: {
        type: 'umd',
        umdNamedDefine: true,
      }
    },
    wasm_library: {
      import: './src/library/detector/wasm_helper.js',
      library: {
        name: '[name]',
        type: 'var',
        export: 'default'
      }
    }
    // shared: 'lodash',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // The `injectType`  option can be avoided because it is default behaviour
          { loader: "style-loader" },
          { loader: "css-loader", options: { modules: true } },
          { loader: "sass-loader" }
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    alias: {
      'utils': path.resolve(__dirname, './src/library/detector/utils')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
  devServer: {
    static: './public',
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './src/index.html',
      chunks: ['vanilla']
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "./static") },
        { from: path.resolve(__dirname, "./src/library/detector/package/utils_bg.wasm") },
        // { from: path.resolve(__dirname, "./src/detector/assets"),
        //   to: path.resolve(__dirname, 'dist/detector/assets'),
        // },
      ],
    })
    // new webpack.ProvidePlugin({
    //   'utils': 'utils',
    //   wasm: path.resolve(path.join(__dirname, ''))
    // })
  ],
};