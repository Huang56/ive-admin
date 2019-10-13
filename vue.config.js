const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    },
    https: false,
    hotOnly: false,
  },
  // 关闭eslint
  // lintOnSave: process.env.NODE_ENV === "development",
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      extensions: [".js", ".vue", ".json", ".less$"],
      alias: {
        vue$: "vue/dist/vue.esm.js",
        "@": resolve("src")
      }
    },
  }
}
