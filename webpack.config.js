const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("autoprefixer"),
];

let cssConfig = {
  test: /\.css$/i,
  use: [
    "css-loader?url=false",
    {
      loader: "postcss-loader",
      options: { postcssOptions: { plugins: postCSSPlugins } },
    },
  ],
};

let config = {
  entry: "./app/assets/scripts/App.js",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./app/index.html",
    }),
  ],
  module: {
    rules: [cssConfig],
  },
};

if (currentTask == "dev") {
  cssConfig.use.unshift("style-loader");
  config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "app"),
  };
  config.devServer = {
    before: function (app, server) {
      server._watch("./app/**/*.html");
    },
    contentBase: path.join(__dirname, "app"),
    hot: true,
    port: 3666,
    host: "0.0.0.0",
  };
  config.mode = "development";
}

if (currentTask == "build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  };
  config.mode = "production";
  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
  };
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" })
  );
}

// let deleteMeLater = {
//   entry: "./app/assets/scripts/App.js",
//   output: {
//     filename: "bundled.js",
//     path: path.resolve(__dirname, "app"),
//   },
//   devServer: {
//     before: function (app, server) {
//       server._watch("./app/**/*.html");
//     },
//     contentBase: path.join(__dirname, "app"),
//     hot: true,
//     port: 3666,
//     host: "0.0.0.0",
//   },
//   mode: "development",
//   // watch: true,
//   module: {
//     rules: [
//       {
//         test: /\.css$/i,
//         use: [
//           "style-loader",
//           "css-loader?url=false",
//           {
//             loader: "postcss-loader",
//             options: { postcssOptions: { plugins: postCSSPlugins } },
//           },
//         ],
//       },
//     ],
//   },
// };

module.exports = config;
