// 画图文件
import {textOverflow, sortPosition} from '../utils'
import {
  btnColor,
  btnDisableColor,
  lineColor,
  headerTextColor,
  tableTextColor,
  activeRowColor,
  cellPaddingWidth,
  stripeColor,
  headerColor,
  rowHeight,
  headerHeight
} from '../config'

const GRAY_TOP = new Image()
GRAY_TOP.src = require('../images/sequence-nor.svg')

const GRAY_TOP_HOVER = new Image()
GRAY_TOP_HOVER.src = require('../images/sequence-UP.svg')

const GRAY_BOTTOM_HOVER = new Image()
GRAY_BOTTOM_HOVER.src = require('../images/sequence-Drop.svg')

const CHECK_BORDER = new Image()
CHECK_BORDER.src = require('../images/checkborder.png')

const CHECK_HENG = new Image()
// CHECK_HENG.src = require('../images/checkheng.png')
CHECK_HENG.src = require('../images/checkborder.png')

const CHECK_DISABLE = new Image()
CHECK_DISABLE.src = require('../images/checkdisable.png')

const CHECK_RIGHT_DISABLE = new Image()
CHECK_RIGHT_DISABLE.src = require('../images/checkrightdisable.png')

const CHECK_RIGHT = new Image()
CHECK_RIGHT.src = require('../images/checkright.png')

const IMG_ICON = new Image()
IMG_ICON.src = require('../images/imgicon.png')

const detail = new Image()
detail.src = require('../images/see-list-table.svg')      //表格查看图标

const edit = new Image()
edit.src = require('../images/edit_list.svg')        //表格修改图标
const edit_dis = new Image()
edit_dis.src = require('../images/edit_list_dis.svg')   //表格修改图标置灰色
const deletes = new Image()
deletes.src = require('../images/delete_table.svg')   //表格删除图标
const deletes_dis = new Image()
deletes_dis.src = require('../images/delete_table_dis.svg')   //表格删除图标
const report = new Image()
report.src = require('../images/upload-table.svg')          //表格上报图标

const download = new Image()
download.src = require('../images/edit_download.svg')          //表格下载图标

const userGroupGoRelavanceUser = new Image()
userGroupGoRelavanceUser.src = require('../images/Associated_users.svg')  //表格关联用户

const userGroupRelavanceUser = new Image()
userGroupRelavanceUser.src = require('../images/Users already associated.svg')  //已关联用户

const userGroupGoRelavanceRole = new Image()
userGroupGoRelavanceRole.src = require('../images/Associated_roles.svg')  //关联角色

const userGroupRelavanceRole = new Image()
userGroupRelavanceRole.src = require('../images/roles-already-Associated.svg')  //已关联角色

const relavanceAuth = new Image()
relavanceAuth.src = require('../images/Related_permissions.svg')             //关联权限

const colm = new Image()
colm.src = require('../images/Column_management.svg')                        //列管理

const moveUp = new Image()
moveUp.src = require('../images/moveUp.svg')             //上移

const moveDown = new Image()
moveDown.src = require('../images/moveDown.svg')             //下移

const transferSend = new Image()
transferSend.src = require('../images/transferSend.svg')             //转单

const pickingType = new Image()
pickingType.src = require('../images/pickingType.svg')             //拣货类型

const cancelOrder = new Image()
cancelOrder.src = require('../images/cancelOrder.svg')             //取消订单

const noData = new Image()
noData.src = require('../images/emptyData_bg.svg')             //没数据

const freeze = new Image()
freeze.src = require('../images/freeze.svg')             //启用

const unfreeze = new Image()
unfreeze.src = require('../images/unfreeze.svg')             //禁用

const view = new Image()
view.src = require('../images/see-list-table.svg')      //表格查看图标

export default {
  data() {
    return {
      detail,
      edit,
      edit_dis,
      deletes,
      deletes_dis,
      report,
      download,
      userGroupGoRelavanceUser,
      userGroupRelavanceUser,
      userGroupGoRelavanceRole,
      userGroupRelavanceRole,
      relavanceAuth,
      colm,
      moveUp,
      moveDown,
      transferSend,
      pickingType,
      cancelOrder,
      freeze,
      view,
      unfreeze,
      isPaintImage: true,
      sortCol: {
        num: 0,
        col: {},
        beforeCol: {}
      },
      checkboxIcon: {
        'true-true': CHECK_RIGHT_DISABLE,
        'true-false': CHECK_RIGHT,
        'false-true': CHECK_DISABLE,
        'false-false': CHECK_BORDER
      }
    }
  },
  methods: {
    // 清除画布
    clearCanvas() {
      const {canvas, ctx} = this
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
    // 从新绘画
    repaint() {
      this.initScroll()
      this.getDisplayRow()
      this.getDisplayCol()
      this.handleShowText()
      this.paint()
    },
    // 绘画
    paint(options = {}) {
      if (this.column.length > 0) {
        requestAnimationFrame(() => {
          this.draw(options)
        })
      }
    },
    // 绘画
    draw(options) {
      this.clearCanvas()
      if (this.flatData.length > 0) {
        this.paintActiveRow()
        this.paintLine()
        this.paintText()
        this.painHeader()
        this.paintFixedLeftColumn()
      } else {
        this.painHeader()
        this.paintFixedLeftColumn()
        this.paintNoData()
      }
      this.paintDivide(options.dividex) // 画分割竖线
      if (this.isPaintImage) {
        this.loadImage()
      }
    },
    // 绘画没有数据的
    paintNoData() {
      const {ctx, canvas, font, fontSize, ratio} = this
      ctx.font = font
      ctx.textBaseline = 'middle'
      ctx.fillStyle = tableTextColor
      ctx.drawImage(noData,canvas.width / 2-100,canvas.height/2-50); 
      // ctx.fillText('暂无数据', canvas.width / 2 - 2 * fontSize, canvas.height/2+2 * fontSize)
    },
    // 画头部
    painHeader(cols, fixed = false, hWidth) {
      const {ctx, ratio, font, fontSize, canvasConfig, scroll, checkedRow, allRowData, excludeSort} = this
      const headerH = headerHeight * ratio
      const disx = fixed ? 0 : scroll.disx
      cols = cols || this.displayCol
      hWidth = hWidth || canvasConfig.aw
      ctx.fillStyle = headerColor
      ctx.fillRect(0, 0, hWidth, headerH)
     
      cols.forEach(item => {
        const x = item.x + item.width - disx + 0.5
        // 竖线
        ctx.font = font
        ctx.beginPath()
        ctx.lineWidth = 0.5 * ratio
        ctx.strokeStyle = lineColor
        ctx.moveTo(x, 0)
        ctx.lineTo(x, headerH)
        ctx.stroke()
        // 横线
        ctx.textBaseline = 'middle'
        ctx.fillStyle = headerTextColor
        let text = item.label
        let textx = item.x + (cellPaddingWidth * ratio) - disx
        if (!this.excludeSort[item.key]) {
          text = textOverflow(this.textCtx, text, item.width, ratio).text
        }
        if (item.key === '$$operation') {
          textx = textx + item.width / 2 - cellPaddingWidth * ratio - fontSize * ratio
        }
        ctx.font = `bold ${font}`
        const texty = headerH / 2
        ctx.fillText(text, textx, texty)
        if (item.key === excludeSort.$$selection) {
          let img = CHECK_BORDER
          if (checkedRow.length > 0 && checkedRow.length < allRowData.length) {
            img = CHECK_HENG
          } else if (checkedRow.length === allRowData.length && allRowData.length > 0) {
            img = CHECK_RIGHT
          }
          ctx.drawImage(img, textx + 6 * ratio, texty - 7 * ratio, 14 * ratio, 14 * ratio)
          return
        }
        if (item.key !== excludeSort.$$index && item.key !== excludeSort.$$operation && !item._showImage && !item._showCheckbox && !item._showUpload) {
          let buttonSort = !item._showButton || (item._showButton && !item.button)
          let showSort = item.width > item.label.length * fontSize + (2 * cellPaddingWidth + 8) * ratio
          if (buttonSort && item.sortable && item.sortable === 'custom' && showSort) {
            this.paintHeaderSort(item, textx, texty, text)
          }
        }
      })
      ctx.font = font
      if (this.scroll.disy > 0) {
        ctx.beginPath()
        ctx.fillStyle = lineColor
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 1
        ctx.shadowBlur = 4
        ctx.shadowColor = 'rgba(0, 0, 0, .1)'
        ctx.fillRect(0, headerH, canvasConfig.aw, 1)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.fillStyle = lineColor
        ctx.fillRect(0, headerH, canvasConfig.aw, 1)
        ctx.stroke()
      }
      // 重置阴影
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.shadowBlur = 0
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
    },
    // 头部排序
    paintHeaderSort(item, textx, texty) {
      const {ctx, ratio, sortCol} = this
      if(this.isOrder){
        sortCol.num=0
      } 
      let w = 20 * ratio
      let x = textx + sortPosition(this.textCtx, item.label)
      let y = texty - 10 * ratio
      if (sortCol.col._index === item._index && sortCol.num) {
        let img = sortCol.num === 0 ?GRAY_TOP: sortCol.num === 1? GRAY_TOP_HOVER : GRAY_BOTTOM_HOVER 

        ctx.drawImage(img, x, y, w, w)
      } else {
        ctx.drawImage(GRAY_TOP, x, y, w, w)
      }
      sortCol.beforeCol = sortCol.col
    },
    // 画线
    paintLine(cols, width, fixed = false) {
      const {ctx, canvas, canvasConfig, scroll, displayRow, ratio} = this
      const disy = scroll.disy
      const disx = fixed ? 0 : scroll.disx
      cols = cols || this.displayCol
      width = width || canvasConfig.aw
      // 画横线
      displayRow.forEach((item, index) => {
        ctx.beginPath()
        ctx.lineWidth = 0.5 * ratio
        ctx.strokeStyle = lineColor
        ctx.moveTo(0 - disx, item.y + 0.5 - disy)
        ctx.lineTo(width - disx, item.y + 0.5 - disy)
        ctx.stroke()
        if (index === displayRow.length - 1) {
          ctx.beginPath()
          ctx.lineWidth = 0.5 * ratio
          ctx.strokeStyle = lineColor
          ctx.moveTo(0 - disx, item.y + 0.5 - disy + rowHeight * ratio)
          ctx.lineTo(width - disx, item.y + 0.5 - disy + rowHeight * ratio)
          ctx.stroke()
        }
        // 画竖线
        cols.forEach(value => {
          let x = value.x + value.width - disx + 0.5
          ctx.beginPath()
          ctx.lineWidth = 0.5 * ratio
          ctx.moveTo(x, item.y + 0.5 - disy)
          ctx.lineTo(x, item.y + 0.5 - disy + rowHeight * ratio)
          ctx.stroke()
        })
      })
      // 画竖线
      // cols.forEach(item => {
      //   let x = item.x + item.width - disx + 0.5
      //   ctx.beginPath()
      //   ctx.lineWidth = 0.5 * ratio
      //   ctx.moveTo(x, 0)
      //   ctx.lineTo(x, canvas.height)
      //   ctx.stroke()
      // })
    },
    // 填充表格文字 图标 图片处理
    paintText(cols, fixed = false) {
      
      const {ctx, ratio, font, scroll, displayRow, displayRowData, checkedRow, flatData, rowH, cachedImages, checkboxRows, page, uploadDisabledRows, excludeSort} = this
      const disy = scroll.disy
      const disx = fixed ? 0 : scroll.disx
      let x = 0
      let y = 0
      cols = cols || this.displayCol
      cols.forEach(col => {
        const key = col.key
        x = col.x - disx + (cellPaddingWidth * ratio)
        // 行
        displayRow.forEach((item, j) => {
          y = item.y - disy + (rowH / 2)
          ctx.font = font
          ctx.textBaseline = 'middle'
          ctx.fillStyle = tableTextColor
          const rowIndex = flatData[item.index]._index - 1
          if (key === excludeSort.$$index) {
            // let t = flatData[item.index]._pageIndex // 排序之后的乱序的
            let t = (item.index + 1) + page.pageSize * (page.currentPage - 1)
            let numberIndex
            if(t>0&&t<10){
              numberIndex=13
            }else if(t>9&&t<100){
              numberIndex=10
            }else if(t>99&&t<1000){
              numberIndex=7
            }
            // ctx.fillText(t, x+numberIndex, y)
            ctx.fillText(t, x + 6, y)
          } else if (key === excludeSort.$$selection) {
            const isFind = checkedRow.some(r => r._gtableuuid === flatData[item.index]._gtableuuid)
            let img = isFind ? CHECK_RIGHT : CHECK_BORDER
            ctx.drawImage(img, x + 6 * ratio, y - 7 * ratio, 14 * ratio, 14 * ratio)
          } else if (key === excludeSort.$$operation) {
            this.paintOperationColumn(item, col)
          } else if (col._showButton) {
           
            this.paintButtonColumn(item, col, rowIndex, displayRowData[j], x, y)
          } else if (col._showCheckbox) {
            const {checked, disabled} = checkboxRows[rowIndex]
            const ck = this.checkboxIcon[`${checked}-${disabled}`]
            ctx.drawImage(ck, x + 6 * ratio, y - 7 * ratio, 14 * ratio, 14 * ratio)
          } else if (col._showImage) {
            let img = cachedImages[`${key}_${rowIndex}`] ? cachedImages[`${key}_${rowIndex}`] : IMG_ICON
            ctx.drawImage(img, x, y - rowH / 2, rowH, rowH)
          } else if (col._showUpload) {
           
            let bcolor = btnColor
            if (uploadDisabledRows[rowIndex].disabled) {
              bcolor = btnDisableColor
            }
            ctx.fillStyle = bcolor
            ctx.fillText('上传', x, y)
          } else {
            const text = displayRowData[j] ? displayRowData[j][key] || '' : ''
            ctx.fillText(text, x, y)
          }
        })
      })
    },
    // 画活动行
    paintActiveRow() {
      const {ctx, rowH, moveRowIndex, canvas, scroll, displayRow, stripe, ratio} = this
      const disy = scroll.disy - (headerHeight - rowHeight) * ratio
      const index = this.calculateActiveIndex()
      if (stripe) {
        displayRow.forEach(item => {
          ctx.beginPath()
          if (item.index !== 0 && item.index % 2 === 1) {
            ctx.fillStyle = stripeColor
          } else {
            ctx.fillStyle = '#fff'
          }
          ctx.fillRect(0, (item.index + 1) * rowH - disy, canvas.width, rowH)
          ctx.stroke()
        })
      }
      if (this.highlight && index !== null) {
        ctx.fillStyle = activeRowColor
        ctx.fillRect(0, (index + 1) * rowH - disy, canvas.width, rowH)
      }
      if (this.highlight && moveRowIndex !== null) {
        ctx.fillStyle = activeRowColor
        ctx.fillRect(0, (moveRowIndex + 1) * rowH - disy, canvas.width, rowH)
      }
    },
    // 画左边固定列
    paintFixedLeftColumn() {
      const {ctx, displayRow, rowH, canvas, moveRowIndex, scroll, fixedLeftCol, stripe} = this
      const disy = scroll.disy
      let index = this.calculateActiveIndex()
      let pWidth = this.fixedLeftWidth
      // 画头部
      // 填充颜色
      displayRow.forEach(obj => {
        let isActive = (index === obj.index) || (moveRowIndex === obj.index)
        let bgcolor = '#fff'
        if (this.highlight && isActive) {
          bgcolor = activeRowColor
        } else if (stripe) {
          if (obj.index !== 0 && obj.index % 2 === 1) {
            bgcolor = stripeColor
          }
        }
        fixedLeftCol.forEach(item => {
          ctx.fillStyle = bgcolor
          ctx.fillRect(item.x, obj.y - disy, item.width, rowH)
        })
      })
      this.paintLine(fixedLeftCol, pWidth, 'blue', true)
      this.paintText(fixedLeftCol, true)
      this.painHeader(fixedLeftCol, true, pWidth)
      // 滚动时候显示阴影
      if (scroll.disx) {
        ctx.beginPath()
        ctx.fillStyle = lineColor
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.shadowBlur = 4
        ctx.shadowColor = 'rgba(0, 0, 0, .2)'
        ctx.fillRect(pWidth, 0, 1, canvas.height)
        ctx.stroke()

        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 0
        ctx.shadowColor = 'rgba(0, 0, 0, .1)'
      }
    },
    // 画操作列
    paintOperationColumn(item, col) {
      const {ctx, ratio, rowH, fontSize, scroll, allFixedRowData, flatData} = this
      const disy = scroll.disy
      let okey = this.excludeSort.$$operation
      let btnx = this.allColData.find(v => v.key === okey).x
      const rowIndex = flatData[item.index]._index - 1
      if (allFixedRowData[rowIndex] && allFixedRowData[rowIndex].length > 0) {
        let x = btnx + cellPaddingWidth * ratio
        const labelAllWidth = allFixedRowData[rowIndex].length * 24
        let left =12;
        if(col.width !== 48){
          left = 8
        }
        // const left = (col.width - labelAllWidth - fontSize * (allFixedRowData[rowIndex].length - 1)) / 2
        // console.log(col.width,labelAllWidth,allFixedRowData,allFixedRowData[rowIndex].length)
        // for (let [index,btnObj] of allFixedRowData[rowIndex]) {
        for (let [index,btnObj] of new Map( allFixedRowData[rowIndex].map( ( item, i ) => [ i, item ] ) )) {
          // let fx = btnx + left;
          let fx
          if(index === 0){
            fx = btnx + (col.width - 24 * ratio * allFixedRowData[rowIndex].length) / 2
          }else{
            fx = btnx + 8 * ratio
          }
          if (
            btnObj.type === 'download'
            || btnObj.type === 'edit'
            || btnObj.type === 'detail'
            || btnObj.type === 'report'
            || btnObj.type === 'report'
            || btnObj.type === 'delete'
            || btnObj.type === 'deletes'
            || btnObj.type === 'userGroupGoRelavanceUser'
            || btnObj.type === 'userGroupRelavanceUser'
            || btnObj.type === 'userGroupGoRelavanceRole'
            || btnObj.type === 'userGroupRelavanceRole'
            || btnObj.type === 'relavanceAuth'
            || btnObj.type === 'colm'
            || btnObj.type === 'moveUp'
            || btnObj.type === 'moveDown'
            || btnObj.type === 'transferSend'
            || btnObj.type === 'pickingType'
            || btnObj.type === 'cancelOrder'
            || btnObj.type === 'freeze'
            || btnObj.type === 'view'
            || btnObj.type === 'unfreeze'
            || btnObj.type === 'goRelavanceRole'
            || btnObj.type === 'relavanceRole') {
            btnObj.type = btnObj.type === 'delete' ? 'deletes' : btnObj.type;  //这里delete是不能申明为变量
            ctx.fillStyle = btnObj.disabled ? btnDisableColor : btnColor
            let ctxImg=btnObj.disabled?btnObj.type+'_dis':btnObj.type
            if (btnObj.type === 'relavanceRole') {
              // ctx.drawImage(this.userGroupRelavanceRole, fx, item.y+3 + (18 * ratio) - disy - 18, 24, 24)
              ctx.drawImage(this.userGroupRelavanceRole, fx, item.y+3 - disy, 24 * ratio, 24 * ratio)
            } else if (btnObj.type === 'goRelavanceRole') {
              // ctx.drawImage(this.userGroupGoRelavanceRole, fx, item.y+3 + (18 * ratio) - disy - 18, 24, 24)
              ctx.drawImage(this.userGroupGoRelavanceRole, fx, item.y+3 - disy, 24 * ratio, 24 * ratio)
            } else {
              // ctx.drawImage(this[ctxImg], fx, item.y+3 + (18 * ratio) - disy - 18, 24, 24)
              ctx.drawImage(this[ctxImg], fx, item.y+3 - disy , 24 * ratio, 24 * ratio)
            }
            // btnx += 12 + fontSize
           
            // btnObj.x = fx
            // btnObj.y = item.y + (18 * ratio) - disy - 16;
            // btnObj.width = 24
            // btnObj.height = 24
            btnx += 24 * ratio
           
            btnObj.x =  fx
            btnObj.y = item.y + 3 - disy;
            btnObj.width = 24 * ratio
            btnObj.height = 24 * ratio
          } else {
            let label = typeof btnObj.label === 'function' ? btnObj.label(this.data[item.index]) : btnObj.label
            ctx.fillStyle = btnObj.disabled ? btnDisableColor : btnColor
            ctx.fillText(label, x, item.y - disy + rowH / 2)
            x += label.length * fontSize + 8
            btnObj.x = fx
            btnObj.y = item.y - disy + rowH / 2;
            btnObj.width = label.length * fontSize
            btnObj.height = fontSize
          }
        }
      }
    },
    paintButtonColumn(item, col, rowIndex, disRowData, x, y) {
      const {ctx, ratio, buttonDisabledRows, buttonOptions, data} = this
      let bcolor = btnColor
      let rowData = data[item.index]
      let btnOpt = buttonOptions[col.key]
      if (buttonDisabledRows[rowIndex] && buttonDisabledRows[rowIndex][col.key]) {
        bcolor = btnDisableColor
      }
      if (col.color && btnOpt.color) {
        bcolor = typeof btnOpt.color === 'function' ? btnOpt.color(rowData) : btnOpt.color
      }
      ctx.fillStyle = bcolor
      if (col.icon) {
        ctx.fillStyle = col.color ? bcolor : 'red'
        ctx.font = `${18 * ratio}px iconfont`
        let icon = (btnOpt.icon && typeof btnOpt.icon === 'function') ? btnOpt.icon(rowData) : btnOpt.icon
        icon = icon && icon.includes('&#x') ? String.fromCharCode(parseInt(icon.replace('&#x', ''), 16)) : ''
        ctx.fillText(icon, x + 6, y)
      } else {
        let btxt = ''
        if (col.button) {
          btxt = typeof col.button === 'function' ? col.button(rowData) : col.button
        } else {
          btxt = disRowData ? disRowData[col.key] || '' : ''
        }
        const {text} = textOverflow(this.textCtx, btxt, col.width, ratio)
        ctx.fillText(text, x, y)
      }
    },
    // 画分割线
    paintDivide(x) {
      if (x) {
        const {ctx, canvas, ratio} = this
        ctx.beginPath()
        ctx.lineWidth = 1 * ratio
        ctx.strokeStyle = lineColor
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
    }
  }
}
