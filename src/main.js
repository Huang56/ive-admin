import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import App from './App.vue'
import router from './router/index'
//全局样式
import './assets/css/global.css' 
import './assets/customTheme/theme.less'

Vue.config.productionTip = false

// 注册iview
Vue.use(iView, {
  transfer: true,
  size: 'small'
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
