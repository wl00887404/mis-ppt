const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: {
    main: "./index.js"
  },
  output: {
    path: path.resolve(__dirname, "./public/"),
    filename: "[name].bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2015", "stage-2", "react"]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader?modules"]
      },
      {
        test: /\.(sass|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|mp4|webm)$/,
        use: ["file-loader?name=[name].[ext]&outputPath=asset/"]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
    })
  ]
};
