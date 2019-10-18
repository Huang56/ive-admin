import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import App from './App.vue'
import store from './store/index' // vuex
import router from './router/index'
//全局样式
import './assets/css/global.css' 
import './assets/customTheme/theme.less'
import './assets/font/style.css'//图标字体

Vue.config.productionTip = false

// 注册全局指令, 组件
import './common/index.js'

// 注册iview
Vue.use(iView, {
  transfer: true,
  size: 'small'
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
