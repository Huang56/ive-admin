import Sortable from 'sortablejs';
import Vue from 'vue';

export default {
  name: "draggable",
  inserted(el, binding) {
    const element = el.querySelector(".ivu-table-wrapper  .ivu-table-header  thead tr");
    if (!element) return;
    element.onmouseenter = () => {
      let th = element.querySelector('th:empty');
      if (th && !th.classList.contains('ignore-elements')) {
        th.classList.add('ignore-elements');
      }
    };
    Sortable.create(element, {
      ghostClass: 'sortable-ghost',
      filter: ".ignore-elements",
      animation: 150,
      setData: dataTransfer => {
        dataTransfer.setData("Text", "")
      },
      onEnd: evt => {
        if (evt.oldIndex === evt.newIndex) return;
        let array = binding.value.splice(0);
        const targetRow = array.splice(evt.oldIndex, 1)[0];
        array.splice(evt.newIndex, 0, targetRow);
        Vue.nextTick(() => {
          binding.value.push(...array)
        })
      }
    });
  }
};
