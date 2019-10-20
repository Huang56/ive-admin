export default {
    name: "first",
    bind: function (element) {
        el.push(element)
        moveFn();
        window.addEventListener("resize", moveFn)
        document.addEventListener("click", moveFn)
    }
}
let el = []

function moveFn() {
    let timeId = setTimeout(() => {
        el.forEach(item => {
            const preEl = preElFn(item);
            if (preEl == null) return false;
            if (preEl.offsetTop != item.offsetTop) {
                item.style.display = 'flex';
                item.style.justifyContent = 'flex-end';
                item.style.float = 'right';
            } else {
                item.style.display = 'flex';
                item.style.float = 'left'
                item.style.justifyContent = 'flex-start';
            }
        })
        clearTimeout(timeId);
    }, 100)

}

function preElFn(el) {
    let elObj = el.previousElementSibling;
    if (elObj != null && elObj.style.getPropertyValue('display') == 'none') {
        return preElFn(elObj);
    } else {
        return elObj;
    }
}