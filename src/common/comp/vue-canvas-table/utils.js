import { cellPaddingWidth, fontSize } from './config'

// 获取数据
export const getValue = (key, obj) => {
  if (!key) {
    return ''
  }
  // 'a.b[0].c' or 'a.b[0].c[0]'
  if (key.indexOf('.') > 0) {
    let arr = key.split('.')
    let length = arr.length - 1
    return arr.reduce((s, k, i) => {
      let index = k.indexOf('[')
      if (i === length) {
        if (index > 0) {
          return (s[k.substr(0, index)] || [])[+k.substring(index + 1, k.length - 1)]
        }
        return s[k]
      } else {
        if (index > 0) {
          return (s[k.substr(0, index)] || [])[+k.substring(index + 1, k.length - 1)] || {}
        }
        return s[k] || {}
      }
    }, obj)
  }
  // 'a[0]'
  let index = key.indexOf('[')
  if (index > 0) {
    return (obj[key.substr(0, index)] || [])[+key.substring(index + 1, key.length - 1)]
  }
  return obj[key]
}

// 溢出隐藏计算
export const textOverflow = (ctx, text, width, ratio) => {
  let str = ''
  let over = false
  if (text || typeof text === 'number') {
    text = text + ''
    width -= (cellPaddingWidth * 2) * ratio
    let tw = Math.floor(ctx.measureText(text).width) || 1
    if (tw > width) {
      let max = text.length
      let i = Math.floor(max * width / tw)
      i = i < max ? i : max
      over = true
      str = text.substr(0, i - 1) + '...'
      // TODO 后续优化，中英文数字混排时需要多次计算
      tw = Math.floor(ctx.measureText(str).width)
      if (tw > width) {
        str = text.substr(0, i - 3) + '...'
      }
    } else {
      str = text
    }
  }
  return { over, text: str }
}

// 头部排序位置计算
export const sortPosition = (ctx, text) => {
  if (text || typeof text === 'number') {
    text = text + ''
    return Math.floor(ctx.measureText(text).width) || text.length * fontSize
  }
  return 0
}

// 生成uuid
const ustr = () => Math.random().toString(36).substr(3)
export const createUuid = () => ustr() + ustr()

// 加载图片
export const loadImage = async url => {
  const Image = new window.Image()
  Image.src = url
  return new Promise((resolve, reject) => {
    Image.onload = () => {
      resolve(Image)
    }
    Image.onerror = (err) => {
      reject(err)
    }
  })
}


const strReg = /^￥/
// 转成数字
export const toNumber = num => {
  // 如果是人民币的形式, 先去掉￥ 然后在转数字
  if (strReg.test(num)) {
    num = num.substr(1).replace(',', '')
  }
  return isNaN(+num) ? 0 : +num
}
