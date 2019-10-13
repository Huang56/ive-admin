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
    host: 'localhost',
    port: 8080,
    proxy: {  //代理配置
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
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
