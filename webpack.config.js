const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  target: ['web', 'es5'],
  entry: {
    vanilla: {
      import: './src/WebCamProcessor.ts',
      library: {
        name: 'WebCam',
        type: 'umd',
        umdNamedDefine: true,
      }
    },
    // face_mesh: {
    //   import: './src/detector/face_mesh.js',
    //   library: {
    //     name: '[name]',
    //     type: 'var',
    //     export: 'default'
    //   }
    // },
    // wasm_library: {
    //   import: './src/detector/wasm_helper.js',
    //   library: {
    //     name: '[name]',
    //     type: 'var',
    //     export: 'default'
    //   }
    // }
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
      // {
      //   test: /.wasm$/,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: '../assets/[name][ext]'
      //   }
      // }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
    alias: {
      'utils': path.resolve(__dirname, './src/detector/utils')
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: './dist',
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './src/vanilla/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "./src/detector/assets"),
          to: path.resolve(__dirname, 'dist/detector/assets'),
        },
      ],
    })
    // new webpack.ProvidePlugin({
    //   'utils': 'utils',
    //   wasm: path.resolve(path.join(__dirname, ''))
    // })
  ],
};