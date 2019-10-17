import Vue from 'vue'

import directives from './directives/index'

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


// 指令注册
_forEachByObject(directives, (item) => {
  Vue.directive(item.name, item)
})





export default {
  directives,
}
