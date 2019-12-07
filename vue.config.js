module.exports = {
  // 如果网站打包后放在服务器根目录就不用配置publicPath
  // 如果不是就要配置 publicPath: '/目录名',
  // publicPath: '/admin',
  devServer: {
    open: true,
    port: 4567
  },
  configureWebpack: {
    // 配置打包内容,从外部引入,只要配置extemals,vue导入就是从全局那边导入
    externals: {
      // 包名:全局变量名
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }
  }
}
