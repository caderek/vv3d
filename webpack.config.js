const path = require("path")

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "game"),
  },
  devServer: {
    contentBase: path.join(__dirname, "game"),
    compress: true,
    host: "192.168.1.17",
    port: 9000,
  },
}
