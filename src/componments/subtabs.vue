<template>
  <div
    class="tabs"
    v-if="tagList.length > 0"
  >
    <div
      v-for="(item,index) in tagList"
      @contextmenu.prevent='e=>mouseRightKey(e,item,index)'
      class="tab"
      @click="selectTab(item)"
      :title="item.title"
      :class="(item.title === currentTab.title && item.path.includes(currentTab.path[0])) ? 'activeTab' : ''"
      :key="index"
    >
      {{ item.title }}
      <Icon
        @click.stop="closeTab(item)"
        title="关闭"
        class="claseIcon"
        type="md-close"
      />
    </div>
    <div
      class="mouseRightKeyList"
      :style="`left:${mouseRightKeyListLeft}px`"
      v-show="mouseRightKeyFlag"
      v-clickoutside="handleClose"
    >
      <div
        class="mouseRightKeyItem"
        v-for="(item,$index) in mouseRightKeyList"
        :key="$index"
        :class="!item.status ? 'mouseRightKeyDisable':''"
        @click="mouseRightKeyClick(item)"
      >{{item.label}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "subtabs",
  data() {
    return {
      tabList: [],
      routeList: [],
      currentTab: {},
      mouseRightKeyList: [
        {
          label: "左关闭",
          code: 0,
          status: true
        },
        {
          label: "右关闭",
          code: 1,
          status: true
        },
        {
          label: "其他关闭",
          code: 2,
          status: true
        },
        {
          label: "全部关闭",
          code: 3,
          status: true
        }
      ],
      mouseRightKeyFlag: false,
      mouseRightKeyTarget: null,
      mouseRightKeyListLeft: 0,
      mouseRightKeySame: false,
      mouseRightKeyActiveIndex: 0,
      mouseRightKeyTimer: null,
      currentIndex: 0, //当前右键点击的index
      tagList: []
    }
  },
  methods: {
    mouseRightKey(e, item, index) {
      this.mouseRightKeyTarget = e.target
      this.mouseRightKeyActiveIndex = index
      this.mouseRightKeyList.forEach(item => (item.status = true))
      if (e.target.offsetLeft !== this.mouseRightKeyListLeft) {
        this.mouseRightKeyListLeft = e.target.offsetLeft
      }
      if (index === this.tagList.length - 1) {
        this.mouseRightKeyList[1].status = false
      }
      if (index === 0) {
        this.mouseRightKeyList[0].status = false
      }

      if (this.tagList.length === 1) {
        this.mouseRightKeyList[2].status = false
      }

      this.mouseRightKeyFlag = true
      this.currentIndex = index
      clearTimeout(this.mouseRightKeyTimer)
    },
    handleClose(e) {
      this.mouseRightKeyTimer = setTimeout(() => {
        if (!e) {
          this.mouseRightKeyFlag = false
        }
      }, 50)
    },
    mouseRightKeyClick(item) {
      let nextPath
      let tagList
      let closeTabList = [],
        time = 50
      if (item.label === "左关闭") {
        closeTabList = this.tagList.slice(0, this.currentIndex)
        let isContain = closeTabList.some(item => {
          return item.title === this.currentTab.title
        })
        if (isContain) {
          nextPath = this.tagList[this.currentIndex].path[this.tagList[this.currentIndex].path.length - 1]
        }
        tagList = this.tagList.slice(this.currentIndex)
      } else if (item.label === "右关闭") {
        closeTabList = this.tagList.slice(
          this.currentIndex + 1,
          this.tagList.length
        )
        let isContain = closeTabList.some(item => {
          return item.title === this.currentTab.title
        })
        if (isContain) {
          nextPath = this.tagList[this.currentIndex].path[this.tagList[this.currentIndex].path.length - 1]
        }
        tagList = this.tagList.slice(0, this.currentIndex + 1)
      } else if (item.label === "其他关闭") {
        closeTabList = this.tagList
          .slice(0, this.currentIndex)
          .concat(
            this.tagList.slice(this.currentIndex + 1, this.tagList.length)
          )
        nextPath = this.tagList[this.currentIndex].path[this.tagList[this.currentIndex].path.length - 1]
        tagList = [ this.tagList[this.currentIndex] ]
      } else if (item.label === "全部关闭") {
        closeTabList = this.tagList
        nextPath = '/home/'
        tagList = []
      }

      let componentNames = closeTabList.map(item => {
        let currPath = item.path[0]
        return currPath.split("?")[0].split("/").pop()
      })
      componentNames.forEach(item => {
        this.$store.commit("DEL_KEEPALIVE", { component: item })
      })

      this.tagList = tagList
      window.sessionStorage.setItem("tagList", JSON.stringify(this.tagList))
      this.$nextTick(() => {
        nextPath ? this.$router.push({ path: nextPath }) : ""
      })

      this.mouseRightKeyFlag = false
    },
    closeTab(val) {
      let index
      this.tagList.some((item, ind) => {
        if (item.title === val.title && item.path === val.path) {
          index = ind
        }
      })

      let componentsName = val.path.map(item => {
        let nameArr = item.split("?")[0].split("/")
        return nameArr[nameArr.length - 1]
      })
      componentsName.forEach(item => {
        if (this.$store.state.keepAliveComponents.indexOf(item) >= 0) {
          this.$store.commit("DEL_KEEPALIVE", { component: item })
        }
      })
      let nextPath

      if (val.path.includes(this.currentTab.path[0])) {
        // 关闭当前标签
        if (index === this.tagList.length - 1) {
          // 最后一个
          if (this.tagList.length === 1) {
            // 只有一个标签
            nextPath = "/home/"
          } else {
            // 往前一个标签
            nextPath = this.tagList[index - 1].path[
              this.tagList[index - 1].path.length - 1
            ] // 标签内最后的页面
          }
        } else if (index === 0) {
          // 关闭第一个标签
          nextPath = this.tagList[1].path[this.tagList[1].path.length - 1] // 标签内最后的页面
        } else {
          // 关闭中间的标签，往后一个标签移动
          nextPath = this.tagList[index + 1].path[
            this.tagList[index + 1].path.length - 1
          ]
        }
      }

      this.tagList.splice(index, 1)

      window.sessionStorage.setItem("tagList", JSON.stringify(this.tagList))
      this.$nextTick(() => {
        nextPath ? this.$router.push({ path: nextPath }) : ""
      })
    },
    selectTab(val) {
      this.$router.push({ path: val.path[val.path.length - 1] })
      this.currentTab = {
        title: val.title,
        path: [val.path[val.path.length - 1]]
      }
    }
  },
  mounted() {
    let tagList = window.sessionStorage.getItem("tagList")
    if (tagList && tagList !== "") {
      this.tagList = JSON.parse(tagList)
    } else {
      this.$router.push({ name: "homePage" })
    }
    this.currentTab = {
      title: this.$route.meta.title,
      path: [this.$route.fullPath]
    }
  },
  // 存储完整路径    title相同name不同放同一数组
  // 清二级缓存
  watch: {
    $route: function(to, from) {
      if (to.name === "homePage" || to.name === 'invalidpage') {
        this.tagList = []
      } else {
        this.currentTab = { title: to.meta.title, path: [to.fullPath] }
        let titleArr = this.tagList.map(item => item.title)
        if (!titleArr.includes(to.meta.title)) {
          // tag不存在
          this.tagList.unshift({
            title: to.meta.title,
            path: [to.fullPath]
          })
        } else {
          // 已存在
          if (to.meta.index !== undefined) {
            // 进入子页面,将子页面路径加入数组
            this.tagList.forEach(item => {
              if (item.title === to.meta.title) {
                if (!item.path.includes(to.fullPath)) {
                  item.path.push(to.fullPath)
                } else {
                  let ind = item.path.indexOf(to.fullPath)
                  let path = item.path.slice(0, ind + 1)
                  item.path = path
                }
              }
            })
          } else {
            // 进入主页面
            // 进入主页面,删除下级页面缓存,清除下级路径
            // 删除下级页面缓存
            let index
            this.tagList.filter((item,ind) => {
              if (item.path[0] === to.fullPath) {
                index = ind
                return
              }
            })
            if (this.tagList[index].path.length > 1) {
              this.tagList[index].path.map((item, ind) => {
                // 默认最后一段为组件名！！！
                if (ind !== 0) { // 从子页面回来更新数据 --->190215 因补货下架单
                  let comp = item.split('/')
                  comp = comp[comp.length - 1].split('?')[0]
                  this.$store.commit("DEL_KEEPALIVE", { component: comp })
                }
              })
              // 清除下级路径
              this.tagList[index].path = [to.fullPath]
            }
          }
        }
      }
      if (this.tagList.length > 10) {
        this.tagList.pop()
      }
      window.sessionStorage.setItem("tagList", JSON.stringify(this.tagList))
    }
  }
}
</script>

<style lang="less" scoped>
.tabs {
  /*position: absolute;*/
  /*background: #808695;*/
  max-width: 1050px;
  /*z-index: 999;*/
  height: 32px;
  /*left: 214px;*/
  /*top: 0px;*/
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: inline-block;
  transition: width 0.3s;
}
.tab {
  color: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  line-height: 22px;
  padding: 5px 10px;
  /* min-width: 120px; */
  text-align: center;
  /* border-bottom: 1px solid #ddd; */
  display: inline-block;
  /* border-left: 1px solid #ddd; */
  cursor: pointer;
  // background-color: #ffffff33;
  background: rgba(232,234,236,0.2);
  margin-right: 1px;

  /*background-image: linear-gradient(0deg, rgba(255,255,255,0.50) 0%, #FFFFFF 100%);*/
}
.tab:hover {
  // color: #0ec1af;
  color: #fff;
  // background: #e8eaec;
  // opacity: 0.46;
  background: rgba(232,234,236,0.46);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.tab:first-child {
  border-top-left-radius: 4px;
}
.activeTab {
  border-bottom: 1px solid #ffffff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: #ffffff;
  color: #595959;
}
.activeTab:hover {
  color: #226B78;
  background: #ffffff;
}
.claseIcon {
  cursor: pointer;
}


.mouseRightKeyList {
  position: fixed;
  top: 34px;
  left: 800px;
  width: 100px;
  background-color: #fff;
  z-index: 8000;
  border: 1px solid #dcdee2;
  color: rgb(89, 89, 89);
  cursor: pointer;
  .mouseRightKeyItem {
    padding: 0px 20px;
    &:hover {
      background-color: #4c7f97;
      color: #fff;
    }
  }

  .mouseRightKeyDisable {
    color: rgb(204, 204, 204);
    &:hover {
      pointer-events: none;
      background-color: #fff;
      color: rgb(204, 204, 204);
    }
  }
}
</style>
