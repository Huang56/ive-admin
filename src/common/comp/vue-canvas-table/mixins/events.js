import {debounce, cloneDeep} from 'lodash'
import {loadImage} from '../utils'
import {headerHeight} from '../config'

export default {
  data() {
    return {
      activeRowIndex: null, // 活动行，画活动行的时候需要
      moveRowIndex: null, // 鼠标移动到某一行的index
      mouseConfig: { // 鼠标停留在某一行，某一列的数据存储
        isDivide: false,
        divideCol: {},
        divideMovex: 0,
        headCol: {},
        isMove: false
      },
      // 鼠标点击的时候，存储点击行和列
      clickCell: {
        col: {},
        row: {}
      },
      checkedRow: [],
      isCanvasMove: true, // 鼠标否在canvas上移动
      tooltipTimer: null, // 显示提示tooltip，的防抖参数
      tooltipPosition: { // tooltip 位置计算
        x: 0,
        y: 0,
        text: '',
        col: {},
        row: {}
      },
      // 图片显示缓存
      cachedImages: {}
    }
  },
  methods: {
    // canvas事件函数
    canvasEvents() {
      this.handleMouseMove()
      this.addEvents()
    },
    // 添加事件
    addEvents() {
      const {canvas} = this
      canvas.addEventListener('mousedown', this.handleMouseDown)
      canvas.addEventListener('click', this.handleCanvasClick)
      canvas.addEventListener('mouseup', this.handleMouseUp)
      canvas.addEventListener('contextmenu', this.handleCanvasContextMenu)
      canvas.addEventListener('dblclick', this.handleCanvasDbclick)
      canvas.addEventListener('mouseleave', this.handleCanvasMouseLeave)
    },
    // 移除事件
    removeEvents() {
      const {canvas} = this
      canvas.removeEventListener('mousedown', this.handleMouseDown)
      canvas.removeEventListener('click', this.handleCanvasClick)
      canvas.removeEventListener('contextmenu', this.handleCanvasContextMenu)
      canvas.removeEventListener('dblclick', this.handleCanvasDbclick)
      canvas.removeEventListener('mouseleave', this.handleCanvasMouseLeave)
    },
    // 鼠标抬起
    handleMouseUp(e){
      const {boxPosition} = this
      const y = e.clientY - boxPosition.top
      const x = e.clientX - boxPosition.left
      this.mouseUpX=x
      this.mouseUpY=y
    }, 
    // 鼠标按下事件
    handleMouseDown(e) {
      this.updatedBoxPosition()
      const {boxPosition} = this
      const y = e.clientY - boxPosition.top
      const x = e.clientX - boxPosition.left
      this.mouseDownX=x
      this.mouseDownY=y
      this.mouseConfig.isMove = false
      this.slotTooltip.show = false
      this.handleHeaderPoint(x, y)
      this.resetEditCell()
    },
    // 鼠标点击事件
    handleCanvasClick(e) {
     if(Math.abs(this.mouseDownX- this.mouseUpX)>5||Math.abs(this.mouseDownY- this.mouseUpY)>5){
        return
     }
      this.updatedBoxPosition()
      clearTimeout(this.clickTimer)
      if (!this.flatData.length) {
        return
      }
      const {boxPosition} = this
      this.clickTimer = setTimeout(() => {
        const y = e.clientY - boxPosition.top
        const x = e.clientX - boxPosition.left+5
        if (y > headerHeight && this.data.length > 0) {
          this.dealClick(x, y, e)
        }
      }, 200)
    },
    // 鼠标双击事件
    handleCanvasDbclick(e) {
      this.updatedBoxPosition()
      clearTimeout(this.clickTimer)
      if (!this.flatData.length) {
        return
      }
      const {boxPosition, displayRowData, excludeSort} = this
      const y = e.clientY - boxPosition.top
      const x = e.clientX - boxPosition.left
      if (displayRowData.length > 0 && y > headerHeight) {
        const {row, col} = this.getRowAndCol(x, y, x <= this.fixedLeftWidth / this.ratio)
        if(!this.getOriginData(col, row)) return
        const {value, column, rowData} = this.getOriginData(col, row)
        let isSelection = col.key === excludeSort.$$selection
        let isOperation = col.key === excludeSort.$$operation
        if (!isSelection && !isOperation && !col._showButton && !col._showUpload && !col._showImage && !col._showCheckbox) {
          this.$emit('row-dblclick', rowData, column, value,row.index)
        }
        this.resetEditCell()
        this.paint()
      }
    },
    // 鼠标右击事件
    handleCanvasContextMenu(e) {
      this.updatedBoxPosition()
      clearTimeout(this.clickTimer)
      const {boxPosition, scroll, ratio, flatData, fixedLeftWidth, excludeSort} = this
      const y = e.clientY - boxPosition.top
      const x = e.clientX - boxPosition.left
      // 如果右击 在表头 或者 在操作列左边 的位置 就不派发事件
      if (y <= headerHeight || x <= this.excludeSortWidth / ratio) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      // 获取点击的行和列
      const {row, col} = this.getRowAndCol(x, y, x <= fixedLeftWidth / ratio)
      // 如果右击事件 是在 可交互列上 就不派发事件
      let isSelection = col.key === excludeSort.$$selection
      let isOperation = col.key === excludeSort.$$operation
      if (isSelection || isOperation || col._showButton || col._showImage || col._showUpload || col._showCheckbox || col._switch || col._showIcons) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      if (typeof row.index === 'number' && col.key) {
        const text = flatData[row.index][col.key]
        this.editPosition = {
          text,
          left: (col.x - scroll.disx) / ratio,
          top: (row.y - scroll.disy) / ratio + 3,
          width: (col.width / ratio) + 1
        }
        setTimeout(_ => this.editCell.select())
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    },
    // 鼠标移动事件
    handleMouseMove() {
      const {canvas} = this
      const mfn = e => {
        this.isPaintImage = false
        // 更新box的位置，以防滚动造成的box位置差异
        this.updatedBoxPosition()
        // 获取 鼠标相对于box的位置
        const y = e.clientY - this.boxPosition.top
        const x = e.clientX - this.boxPosition.left
        if (this.isCanvasMove) {
          // 处理鼠标移动事件
          this.dealMouseMove(x, y)
        }
      }
      const deb = debounce(mfn, 16.67)
      canvas.addEventListener('mousemove', deb)
    },
    // 分割线事件
    divideMove() {
      document.addEventListener('mousemove', this.divideMouseMove)
      document.addEventListener('mouseup', this.divideMouseUp)
    },
    // 分割线移动移动事件
    divideMouseMove(e) {
      this.updatedBoxPosition()
      const {canvas, ratio, mouseConfig, scroll, boxPosition} = this
      const disx = scroll.disx
      let x = e.clientX - boxPosition.left
      const limit = 40 * ratio
      // 设置分割线最少不小于 40px
      const left = (mouseConfig.divideCol.x - disx + limit) / ratio
      // 设置分割线不大于 canvas 宽度
      const right = (canvas.width - limit) / ratio
      this.mouseConfig.isMove = true
      if (x < left) {
        x = left
      } else if (x >= right) {
        x = right
      }
      this.mouseConfig.divideMovex = x
      this.isCanvasMove = false
      this.paint({dividex: x * ratio})
    },
    // 分割线鼠标抬起事件
    divideMouseUp(e) {
      document.removeEventListener('mousemove', this.divideMouseMove)
      document.removeEventListener('mouseup', this.divideMouseUp)
      if (this.mouseConfig.isMove) {
        this.isCanvasMove = true
        this.setMouseStyle('default')
        const {ratio, mouseConfig, scroll} = this
        const disx = scroll.disx
        const w = mouseConfig.divideMovex - ((mouseConfig.divideCol.x - disx) / ratio)
        const cx = ((mouseConfig.divideCol.x + mouseConfig.divideCol.width - disx) / ratio) - mouseConfig.divideMovex
        let index = mouseConfig.divideCol._index
        this.allColData[index].width = w * ratio
        let len = this.allColData.length
        for (let i = index + 1; i < len; i++) {
          this.allColData[i].x = this.allColData[i].x - (cx * ratio)
        }
        if (this.showHScrollbar && cx > 0 && this.displayCol[this.displayCol.length - 1]._index === this.allColData[len - 1]._index) {
          this.scroll.disx -= cx
          if (this.displayCol[0].x - cx < 0) {
            this.scroll.disx = 0
            this.hScrollbar.style.left = 0
          }
        }
        this.initScroll()
        this.getDisplayCol()
        this.handleShowText()
        this.paint()
        this.mouseConfig.isDivide = false
      } else {
        this.paint()
      }
    },
    // 鼠标移出canvase事件
    handleCanvasMouseLeave() {
      this.moveRowIndex = null
      if (!this.flatData.length) {
        return
      }
      this.paint()
      this.setTooltipPosition()
    },
    // 计算鼠标所在的点位置
    handleHeaderPoint(x, y) {
      // 不是表头
      if (y >= headerHeight) {
        return
      }
      const {scroll, mouseConfig} = this
      const disx = scroll.disx
      // 处理按下表头相关的信息
      this.dealHeaderPoint(x)
      // 如果按下位置在鼠标 分割线位置
      if (mouseConfig.isDivide) {
        let x = mouseConfig.divideCol.x + mouseConfig.divideCol.width - disx
        this.paint({dividex: x})
        // 处理分割线移动事件
        this.divideMove()
      } else {
        let col = mouseConfig.headCol
        let key = col.key
        if (key === this.excludeSort.$$selection) {
          this.dealSelectRow()
          this.paint()
          return
        }
        let remoteSort = col.sortable && col.sortable === 'custom'
        let isButtonSort = !col._showButton || (col._showButton && !col.button)
        if (remoteSort && isButtonSort && !col._showImage && !col._showCheckbox && !col._showUpload) {
          this.handleSort()
          this.paint()
        }
      }
    },
    // 处理选择行
    dealSelectRow() {
      const {flatData} = this
      if (this.checkedRow.length === 0) {
        this.checkedRow = cloneDeep(flatData)
      } else if (this.checkedRow.length > 0 && this.checkedRow.length < flatData.length) {
        this.checkedRow = cloneDeep(flatData)
      } else {
        this.checkedRow = []
      }
      this.emitChangeSelect()
    },
    // 处理鼠标单击函数
    dealClick(x, y, e) {
      const {ratio, fontSize, allFixedRowData, buttonDisabledRows, flatData, excludeSort} = this
      const {row, col} = this.getRowAndCol(x, y, x <= this.fixedLeftWidth / ratio)
      const oldActiveRowIndex = this.activeRowIndex
      this.clickCell.col = col
      this.clickCell.row = row
      this.activeRowIndex = flatData[row.index] ? flatData[row.index]._index : -1
      if (this.activeRowIndex === -1) {
        return
      }
      const {value, column, rowData, newRow} = this.getOriginData(col, row)
    
     
      if (col.key === excludeSort.$$selection) {
        // 只有点击复选框才选中
        this.handleCheckedRow(row)
      } else if (col.key === excludeSort.$$operation) {
        const rowIndex = flatData[row.index]._index - 1
        const btnArr = allFixedRowData[rowIndex]
        for (let btn of btnArr) {
          if (x > btn.x / ratio && x < (btn.x + btn.width) / ratio) {
              //disabled禁用事件
            if(btn.disabled) return
            this.$emit('row-edit', rowData, btn,row.index)
            break
          }
        }
      } else if (col._showButton) {
        const rowIndex = flatData[row.index]._index - 1
        if (!buttonDisabledRows[rowIndex] || !buttonDisabledRows[rowIndex][col.key]) {
          const mask = flatData[row.index].hasOwnProperty(col.key + 'Mask')
          const virtual = flatData[row.index].hasOwnProperty(col.key + 'Virtual')
          this.setSlotTooltip(flatData[row.index], column, value, x, y, row)
          this.$emit('cell-click', rowData, column, value, flatData[row.index], mask, virtual)
        }
      } else if (col._showCheckbox) {
        this.dealCheckbox(row, col)
      } else if (col._showUpload) {
        this.dealUpload(row, col)
      } else if (col._switch) {
        newRow[col.key] = newRow[col.key] === col.value.active ? col.value.inactive : col.value.active
        this.$emit("switch", rowData, column, rowData[col.key])
      } else if (col._showImage) {
        this.$emit('image-click', rowData, column)
      } else {
        // 纯文本列
        this.$emit('row-click', rowData, column, e, value,row.index)
      }
      this.paint()
      this.subCurrentChange(this.activeRowIndex, oldActiveRowIndex)
    },
    // 分发current-change 函数
    subCurrentChange(x1, x2) {
      const obj1 = x1 < 0 ? null : this.data[x1 - 1]
      const obj2 = x2 < 0 ? null : this.data[x2 - 1]
      this.$emit('current-change', obj1, obj2)
    },
    // 处理点击单元格方法
    handleCheckedRow(row) {
      if (!this.selection) {
        return false
      }
      const {checkedRow, flatData} = this
      let index = null
      const rowData = flatData[row.index]
      const isFind = checkedRow.some((item, i) => {
        index = i
        return item._gtableuuid === rowData._gtableuuid
      })
      if (!isFind) {
        this.checkedRow.push({_index: rowData._index, _gtableuuid: rowData._gtableuuid})
      } else if (index !== null) {
        this.checkedRow.splice(index, 1)
      }
      this.emitChangeSelect()
    },
    // 分发选择事件
    emitChangeSelect() {
      const {checkedRow, data} = this
      let arr = []
      if (checkedRow.length > 0) {
        arr = checkedRow.map(item => data[item._index - 1])
      }
      this.$emit('selection-change', arr)
    },
    //选中checkbox
    toggleRowSelection(index) {
      this.handleCheckedRow(this.allRowData[index])
    },
    // 计算排序
    handleSort() {
      const {sortCol, mouseConfig} = this
      const col = mouseConfig.headCol
      sortCol.col = col
      if (sortCol.beforeCol._index !== col._index) {
        sortCol.num = 1
      } else {
        sortCol.num += 1
        if (sortCol.num > 2) {
          sortCol.num = 0
        }
      }
      if (this.flatData.length > 0) {
        this.moveRowIndex = null
      }
      let order = null
      let remoteSort = col.sortable && col.sortable === 'custom'
      if (sortCol.num === 1) {
        order = 'asc'
        !remoteSort && this.riseSort()
      } else if (sortCol.num === 2) {
        order = 'desc'
        !remoteSort && this.downSort()
      } else {
        order = 'normal'
        !remoteSort && this.defaultSort()
      }
      if (remoteSort) {
        this.$emit('sort-change', {column: col, prop: col.key, order})
      }
    },
    // 处理头部位置
    dealHeaderPoint(x) {
      const {allColData, mouseConfig, scroll, ratio} = this
      // 如果鼠标位置在左边固定列
      if (x <= this.fixedLeftWidth / ratio + 4) {
        this.setMouseStyle('default')
        mouseConfig.isDivide = false
        for (let col of this.fixedLeftCol) {
          let w = (col.x + col.width) / ratio
          if (w > x) {
            mouseConfig.headCol = col
            break
          }
        }
      } else {
        for (let col of allColData) {
          let w = (col.x + col.width - scroll.disx) / ratio
          // 这位置是分割线位置
          if ((x < w && x > w - 4) || (x >= w && x < w + 4)) {
            mouseConfig.isDivide = true
            mouseConfig.divideCol = col
            this.setMouseStyle('col-resize')
            break
          } else {
            this.setMouseStyle('default')
            mouseConfig.isDivide = false
            if (w > x) {
              mouseConfig.headCol = col
              break
            }
          }
        }
      }
    },
    // 处理鼠标移动事件
    dealMouseMove(x, y) {
      this.setMouseStyle('default')
      const {ratio, mouseConfig, allColData, scroll, excludeSort} = this
      const disx = scroll.disx
      const isLeft = x <= this.fixedLeftWidth / ratio + 4
      // 鼠标在表头，并且鼠标不是在分割线移动状态
      if (y <= headerHeight && !mouseConfig.isDivide) {
        this.setTooltipPosition()
        if (!isLeft) {
          for (let col of allColData) {
            let w = (col.x + col.width - disx) / ratio
            if ((x < w && x > w - 4) || (x >= w && x < w + 4)) {
              // 这位置是分割线位置
              this.setMouseStyle('col-resize')
              break
            }
            this.setMouseStyle('default')
          }
        }
        return
      }
      // 避免无数据时重绘
      if (!this.flatData.length || y <= headerHeight) {
        return
      }
      const {col, row} = this.getRowAndCol(x, y, isLeft)
      let isSelection = col.key === excludeSort.$$selection
      let isOperation = col.key === excludeSort.$$operation
      let mouseStyle = isSelection || isOperation || col._showButton || col._showCheckbox || col._showUpload || col._switch
        ? 'pointer'
        : 'default'
      this.setMouseStyle(mouseStyle)
      if (isSelection || col._showImage || col._showCheckbox || col._switch || col._showIcons) {
        this.setTooltipPosition()
      } else {
        this.setTooltip(col, row, x, y)
      }
      this.paint()
    },
    // 设置鼠标样式
    setMouseStyle(str) {
      this.canvas.style.cursor = str
    },
    // 显示tooltip
    setTooltip(col, row, x, y) {
      const {displayOverRowData, flatData, allFixedRowData, scroll, ratio, tooltipPosition} = this
      const disx = scroll.disx
      const disy = scroll.disy
      const item = displayOverRowData.find(item => item._index === row.index)
      clearTimeout(this.tooltipTimer)
      if (tooltipPosition.col._index !== col._index || tooltipPosition.row.index !== row.index) {
        this.setTooltipPosition()
      }
      this.tooltipTimer = setTimeout(() => {
        if (item && col.key) {
          if (col.key === '$$operation') {
            const rowIndex = flatData[row.index]._index - 1
            const btnArr = allFixedRowData[rowIndex]
            let btn = btnArr.find(btn => x > btn.x / ratio && x < (btn.x + btn.width) / ratio)
            if (btn) {
              this.tooltipPosition.x = x
              this.tooltipPosition.y = y
              this.tooltipPosition.text = btn.label
              this.tooltipPosition.col = col
              this.tooltipPosition.row = row
              this.setTooltipPosition(true)
            } else {
              this.setTooltipPosition()
            }
          } else {
            if (item[col.key]) {
              let text = flatData[row.index][col.key]
              let x = (col.width / 2 + col.x - disx) / ratio
              let y = (row.y - disy) / ratio
              this.tooltipPosition.x = x
              this.tooltipPosition.y = y
              this.tooltipPosition.text = text
              this.tooltipPosition.col = col
              this.tooltipPosition.row = row
              this.setTooltipPosition(true)
            } else {
              this.setTooltipPosition()
            }
          }
        } else {
          this.setTooltipPosition()
        }
      }, 500)
    },
    setSlotTooltip(rowData, col, val, x, y, row) {
      x = (col.width / 2 + col.x - this.scroll.disx) / this.ratio
      y = (row.y - this.scroll.disy + 15) / this.ratio
      this.slotTooltip.left = x
      this.slotTooltip.top = y
      this.slotTooltip.row = rowData
      this.slotTooltip.column = col
      this.slotTooltip.value = val
    },
    setTooltipPosition(show = false) {
      this.tooltip = {
        content: this.tooltipPosition.text,
        left: this.tooltipPosition.x,
        top: this.tooltipPosition.y,
        show
      }
    },
    // 加载图片
    async loadImage() {
      const {displayRow, getImageOptions, flatData} = this
      let ileng = getImageOptions.length
      if (getImageOptions.length > 0 && flatData.length > 0 && Object.keys(this.cachedImages).length < flatData.length * ileng) {
        for (let row of displayRow) {
          for (let key of getImageOptions) {
            if (!this.cachedImages[`${key}_${row.index}`]) {
              let img
              try {
                img = await loadImage(flatData[row.index][key])
              } catch (err) {
                img = null
              }
              this.cachedImages[`${key}_${row.index}`] = img
            }
          }
        }
        this.clearCanvas()
        this.paintActiveRow()
        this.paintLine()
        this.paintText()
        this.painHeader()
        this.paintFixedLeftColumn()
      }
    },
    dealCheckbox(row, col) {
      const {checkboxRows, data} = this
      let opt = checkboxRows[row.index]
      if (!opt.disabled) {
        opt.checked = !opt.checked
        this.$emit('cell-checkbox', data[row.index], col.key, opt)
      }
    },
    dealUpload(row, col) {
      const {uploadDisabledRows, data} = this
      if (!uploadDisabledRows[row.index].disabled) {
        this.$emit('cell-upload', data[row.index], col.key)
      }
    }
  },
  beforeDestroy() {
    this.removeEvents()
  }
}
