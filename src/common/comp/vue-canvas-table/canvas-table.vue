<template>
  <div>
    <div ref="box" class="box table-canvas-box__scroll" >
      <div class="canvasBox" ref="canvasBox">
        <canvas ref="canvas" width="1200" :height="cHeight-10" v-mousewheel="vMouseWheel"></canvas>
        <!-- <div ref="vertical" class="vScroll" v-show="showVScrollbar && showVs"> -->
        <div ref="vertical" class="vScroll" v-show="showVScrollbar ">
          <div ref="vScrollbar" class="vScrollBar"></div>
        </div>
      </div>
      <div ref="horizontal"
           :class="dialog&&showHScrollbar ? 'hScroll-dialog' : 'hScroll'"
           :style="hScrollStyle">
        <div ref="hScrollbar" v-show="showHScrollbar" class="hScrollBar">
          <!-- :class="{'theme-fuying': depotId > 2}" -->
        </div>
      </div>
      <input class="input-content"
             ref="editCell"
             readonly
             :style="{left: editPosition.left + 2 + 'px', top: editPosition.top - 2 + 'px', width: editPosition.width - 2 + 'px'}"
             :value="editPosition.text"/>
      <tooltip :arrow="false"
               :content="tooltip.content"
               :left="tooltip.left"
               :top="tooltip.top"
               :show="tooltip.show"/>
      <tooltip :left="slotTooltip.left"
               :top="slotTooltip.top"
               :show="slotTooltip.show">
        <slot name="tooltip"></slot>
      </tooltip>
    </div>
    <canvas ref="textCanvas"
            width="0"
            height="0"
            style="display:none;"></canvas>
  </div>
</template>

<script>
  import {debounce} from 'lodash'
  import mixins from './mixins'
  import Tooltip from './tooltip'
  import {rowHeight} from './config'
  import Mousewheel from "./mousewheel";
  import {addResizeListener, removeResizeListener} from "./resize-observer/resize-event";

  const DEFAULT_HEIGHT = 50 * rowHeight

  export default {
    name: 'vue-canvas-table',
    props: {
      column: {
        type: Array,
        default() {
          return {}
        }
      },
      data: {
        type: Array,
        default() {
          return []
        }
      },
      operation: {
        type: Object,
        default() {
          return {}
        }
      },
      isOrder:{
          type: Boolean,
          default:false
      },
      options: {
        type: Object,
        default() {
          return {}
        }
      },
      buttonOptions: {
        type: Object,
        default() {
          return {}
        }
      },
      imageOptions: {
        type: Object,
        default() {
          return {}
        }
      },
      checkedOptions: {
        type: Object,
        default() {
          return {}
        }
      },
      uploadOptions: {
        type: Object,
        default() {
          return {}
        }
      },
      height: {
        type: [String, Number],
        default: DEFAULT_HEIGHT
      },
      isScroll: {
        type: Boolean,
        default: false
      },
      page: {
        type: Object,
        default() {
          return {
            pageSize: 50,
            currentPage: 1
          }
        }
      },
      stripe: {
        type: Boolean,
        default: true
      },
      selection: {
        type: Boolean,
        default: false
      },
      dialog: {
        type: Boolean,
        default: true
      },
      remoteForm: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Tooltip
    },
    mixins: mixins,
    directives: {
      Mousewheel
    },
    computed: {
      getButtonOptions() {
        // console.log(this.buttonOptions)
        if (this.buttonOptions) {

          return Object.keys(this.buttonOptions)
        }
        return []
      },
      getImageOptions() {
        if (this.imageOptions) {

          return Object.keys(this.imageOptions)
        }
        return []
      },
      getCheckedOptions() {
        if (this.checkedOptions) {
          return Object.keys(this.checkedOptions)
        }
        return []
      },
      getUploadOptions() {
        if (this.uploadOptions) {
          return Object.keys(this.uploadOptions)
        }
        return []
      },
      fixedRight() {
        return (this.operation && this.operation.options && this.operation.options.length > 0)
      },
      hScrollStyle() {
        return this.dialog ? null : {left: `${this.menuWidth + 16}px`, bottom: 0}
      },
    },
    data() {
      const {depotId = 1} = JSON.parse(sessionStorage.getItem('warehouse') || '{}');
      return {
        depotId,
        showVs: false,
        menuWidth: 160,
        cHeight: DEFAULT_HEIGHT,
        resizeThrottle: null,
        isActivated: false,
        tooltip: {
          content: '',
          left: 0,
          top: 0,
          show: false
        },
        slotTooltip: {
          left: 0,
          top: 0,
          row: null,
          column: null,
          value: null,
          show: false
        },
        editPosition: {
          top: -10000,
          left: -10000,
          text: '',
          width: 0
        }
      }
    },
    methods: {
      windowResize() {
        this.$nextTick(() => {
          this.scroll.disy = 0
          this.setCanvas()
          this.initScroll()
          this.calculate()
        })
      },
      handleKeyDown(e) {
        let code = e.keyCode
        switch (code) {
          case 37: // 左
            this.handleHScrollbarMove(parseInt(this.$refs.hScrollbar.style.left), -16 / this.ratio)
            break
          case 39: // 右
            this.handleHScrollbarMove(parseInt(this.$refs.hScrollbar.style.left), 16 / this.ratio)
            break
          case 38: // 上
            this.handleVScrollbarMove(parseInt(this.$refs.vScrollbar.style.top), -16 / this.ratio)
            break
          case 40: // 下
            this.handleVScrollbarMove(parseInt(this.$refs.vScrollbar.style.top), 16 / this.ratio)
            break
        }
      },
      resetEditCell() {
        this.editPosition = {
          top: -10000,
          left: -10000,
          text: '',
          width: 0
        }
      },
      setCanvasWidth() {
        this.$nextTick(() => {
          this.setCanvas()
          this.initScroll()
          this.calculate()
        })
      },
      clearCurrentChange() {
          this.scroll.disy = 0
        this.scroll.disx = 0
        this.activeRowIndex = null
        this.moveRowIndex = null
        this.checkedRow = []
        if (this.checkedRow.length) {
          this.$emit('selection-change', [])
        }
        this.subCurrentChange(-1, -1)
        this.setTooltipPosition()
        if (this.hScrollbar) {
          this.hScrollbar.style.left = 0
        }

      },
      reloadData() {
        this.clearCurrentChange()
        this.resetEditCell()
        this.integrateData()
        this.initScroll()
        this.calculate()
      },
      // 外部控制列是否显示
      setTableColumns() {
        this.clearCurrentChange()
        this.integrateData()
        this.initScroll()
        this.calculate()
      },
      // 返回排序后的原数组，与 el-table 保持 api 一致
      tableData() {
        return this.flatData.map(v => ({...this.data[v._index - 1]}))
      },
      showSlotToolTip(val = true) {
        this.slotTooltip.show = val
      }
    },
    mounted() {
      this.cHeight = parseInt(this.height)

      this.$nextTick(() => {
        this.getDom()
        this.integrateData()
        this.initScroll()
        this.calculate()
        this.canvasEvents()
        this.isActivated = true
      })
      this.resizeDebounce = debounce(this.windowResize, 200)
      window.addEventListener('resize', this.resizeDebounce)
      addResizeListener(this.$el, this.resizeDebounce);

    },
    activated() {

      if (this.isActivated) {
        setTimeout(() => {
          this.setCanvas()
          this.initScroll()
          this.calculate()
        }, 100)
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeDebounce)
      document.removeEventListener('keydown', this.handleKeyDown)
      removeResizeListener(this.$el, this.resizeDebounce);
    },
    watch: {
      height(val) {
        this.initScroll()
        this.cHeight = parseInt(val)
        this.$nextTick(() => {
          this.setCanvas()
          this.initScroll()
          this.calculate()
        })
      },
      data() {
        this.clearCurrentChange()
        this.resetEditCell()
        this.integrateData()
        this.initScroll()
        this.calculate()
      },
      column() {
        this.setTableColumns()
      },
      menuWidth() {
        if (!this._inactive) {
          this.setCanvasWidth()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .box {
    width: 100%;
    height: 100%;
    position: relative;
    /* 强行开启GPU加速 */
    transform: translate3d(0, 0, 0.001);
  }
  .hScroll-dialog{
    // bottom: -10px !important;
    margin-top:10px;
    height: 10px;
    // background: #d8d8d8;
  }
  .canvasBox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    border: 1px solid #dcdae2;
    user-select: none;
    // border-radius: 8px 8px 0 0;
  }

  .box canvas {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    position: absolute;
    left: 0;
    top: 0;
  }

  .input-content {
    margin: 0;
    outline: none;
    padding: 0 6px;
    top: -10000px;
    left: -10000px;
    /* box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 5px; */
    /* border: 2px solid #9571e9; */
    border: none;
    color: #333;
    border-radius: 0;
    font-size: 12px;
    position: absolute;
    background-color: #e0f5f6;
    z-index: 10;
    box-sizing: border-box;
    height: 28px;
    overflow-x: hidden;
    overflow-y: auto;
    word-break: break-all;
    letter-spacing: 0.3px;
  }

  .hScroll {
    height: 8px;
    position: fixed;
    right: 16px;
    z-index: 10;
    background-color: #ffffff;
    &-dialog {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  .hScrollBar {
    user-select: none;
    height: 10px;
    // background-color: #15697F;
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
  }

  .vScroll {
    width: 8px;
    height: 100%;
    position: absolute;
    top: 32px;
    right: 0;
  }

  .vScrollBar {
    user-select: none;
    width: 8px;
    background-color: #15697F;
    border-radius: 6px;
    cursor: pointer;
    position: absolute;
    right: 0;
    z-index: 9;
  }
</style>
