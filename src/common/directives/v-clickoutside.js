import Vue from "vue";
// vue实例是否渲染于服务端
const isServer = Vue.prototype.$isServer;

// 事件监听
const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  }
  return function (element, event, handler) {
    if (element && event && handler) {
      element.attachEvent("on" + event, handler);
    }
  };
})();

const nodeList = [];
const ctx = "@@clickoutsideContext";

let startClick;

!Vue.prototype.$isServer && on(document, "mousedown", e => (startClick = e));

!Vue.prototype.$isServer &&
  on(document, "mouseup", e => {
    nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
  });

function createDocumentHandler(el, binding, vnode) {
  return function (mouseup = {}, mousedown = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))
    )
      return;

    if (
      binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]
    ) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-clickoutside="handleClose">
 * ```
 */

export default {
  name: "clickoutside",
  // 组件初始化时，调用
  bind(el, binding, vnode) {
    console.log('directive-bind')
  },
  // 组件更新，调用
  update(el, binding, vnode) {

    // 判断指令中是否绑定了函数
    if (binding.expression) {
      console.log('directive-update');
      console.log('directive-update',startClick);
      // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
      binding.value(startClick);
    }

  },
  // 绑定组件移出的时候调用
  unbind(el) {
    console.log('directive-unbind')
  }
};
