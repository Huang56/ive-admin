import Vue from 'vue'

import comp from './comp/index' //全局公共组件
import directives from './directives/index' // 指令
import * as helper from './util/helper' // 全局自定一属性，方法
// 注册函数
function _forEachByObject(obj, projection) {
  try {
    Object.keys(obj).forEach((key) => {
      projection && projection(obj[key], key)
    })
  } catch (e) {
    console.log(e, '全局指令或组件注册失败')
  }
}

// 全局组件注册
_forEachByObject(comp, (item) => {

  Vue.component(item.name, item)
})


// 指令注册
_forEachByObject(directives, (item) => {
  Vue.directive(item.name, item)
})

// 注册全局属性，和方法

Vue.use(helper)

export default {
  directives,
}
