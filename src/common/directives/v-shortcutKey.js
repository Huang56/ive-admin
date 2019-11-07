const hotKeyList = {
  "S": 83,
  "O": 79,
  "Q": 81,
  "R": 82,
  'ESC': 27,
};

function bindEvent(e, el, arg) {

  if (!el || !arg) {
    return
  }
  el.displayFlag = checkDisplay(el)
  if (el.displayFlag) {

    let keyCode = e.keyCode || e.which || e.charCode;
    let ctrlKey = e.ctrlKey || e.metaKey;

    if (arg === 'ESC' && keyCode === hotKeyList[arg]) {
      console.log(el, arg)
      el.click()
      e.preventDefault();
      e.returnValue = false;
      return false;


    } else {
      if (ctrlKey && keyCode === hotKeyList[arg]) {
        console.log(el, arg)
        el.click()
        e.preventDefault();
        e.returnValue = false;
        return false;

      }

    }


  }

}


function checkDisplay(el) {
  // console.log(el)
  if (!el) {
    return true
  }

  if (el.localName === "body") {
    return true
  }
  if (el.style.display === 'none') {
    return false
  } else {
    if (el.style.display === 'block') {
      return true
    } else {
      return checkDisplay(el.parentNode)
    }
  }
}


export default {
  name: "shortcutKey",
  inserted(el, binding) {
    // console.log('inserted')
    if (hotKeyList[binding.arg]) {

      window.removeEventListener('keydown', e => bindEvent(e, el, binding.arg))
      window.addEventListener('keydown', e => bindEvent(e, el, binding.arg))


    }
  },


  unbind() {
    window.removeEventListener('keydown', bindEvent)
  }
};
