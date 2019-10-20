<template>
  <div class="tabs" v-if="tagList.length > 0">
    <div
      v-for="(item,index) in tagList"
      @contextmenu.prevent="e=>mouseRightKey(e,item,index)"
      class="tab"
      :class="(item.title === currentTab.title && item.path.includes(currentTab.path[0])) ? 'activeTab' : ''"
      @click="selectTab(item)"
      :title="item.title"
      :key="index"
    >
      {{ item.title }}
      <Icon @click.stop="closeTab(item)" title="关闭" class="claseIcon" type="md-close"/>
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
  // name: "subtabs",
  components: {},
  props: {},
  data() {
    return {
      tagList: [],
      // tabMouseEvent
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
      mouseRightKeyListLeft: 0,
      currentIndex: 0, //当前右键点击的index
      currentTab: {},
      mouseRightKeyTimer: null
    };
  },
  methods: {
    // 关闭当前Tab
    closeTab(val) {
      console.log("closeTab");
      let index;
      this.tagList.some((item, ind) => {
        if (item.title === val.title && item.path === val.path) {
          index = ind;
        }
      });

      let componentsName = val.path.map(item => {
        let nameArr = item.split("?")[0].split("/");
        return nameArr[nameArr.length - 1];
      });
      componentsName.forEach(item => {
        if (this.$store.state.keepAliveComponents.indexOf(item) >= 0) {
          this.$store.commit("DEL_KEEPALIVE", { component: item });
        }
      });
      let nextPath;

      if (val.path.includes(this.currentTab.path[0])) {
        // 关闭当前标签
        if (index === this.tagList.length - 1) {
          // 最后一个
          if (this.tagList.length === 1) {
            // 只有一个标签
            nextPath = "/home/";
          } else {
            // 往前一个标签
            nextPath = this.tagList[index - 1].path[
              this.tagList[index - 1].path.length - 1
            ]; // 标签内最后的页面
          }
        } else if (index === 0) {
          // 关闭第一个标签
          nextPath = this.tagList[1].path[this.tagList[1].path.length - 1]; // 标签内最后的页面
        } else {
          // 关闭中间的标签，往后一个标签移动
          nextPath = this.tagList[index + 1].path[
            this.tagList[index + 1].path.length - 1
          ];
        }
      }

      this.tagList.splice(index, 1);

      window.sessionStorage.setItem("tagList", JSON.stringify(this.tagList));
      this.$nextTick(() => {
        nextPath ? this.$router.push({ path: nextPath }) : "";
      });
    },

    handleClose(e) {
      console.log("handleClose");
      this.mouseRightKeyTimer = setTimeout(() => {
        if (!e) {
          this.mouseRightKeyFlag = false;
        }
      }, 50);
    },
    // 显示close-Tab-list
    mouseRightKey(e, item, index) {
      console.log("mouseRightKey");
      // close-Tab-list 定位
      if (e.target.offsetLeft !== this.mouseRightKeyListLeft) {
        this.mouseRightKeyListLeft = e.target.offsetLeft;
      }
      // 重置，是否可点击
      this.mouseRightKeyList.forEach(item => (item.status = true));
      if (e.target.offsetLeft !== this.mouseRightKeyListLeft) {
        this.mouseRightKeyListLeft = e.target.offsetLeft;
      }
      if (index === this.tagList.length - 1) {
        this.mouseRightKeyList[1].status = false;
      }
      if (index === 0) {
        this.mouseRightKeyList[0].status = false;
      }

      if (this.tagList.length === 1) {
        this.mouseRightKeyList[2].status = false;
      }

      this.currentIndex = index;
      this.mouseRightKeyFlag = true;
      clearTimeout(this.mouseRightKeyTimer); // 清除判断定时器
    },
    // 激活Tab
    selectTab(val) {
      console.log("selectTab");
      this.$router.push({ path: val.path[val.path.length - 1] });
      this.currentTab = {
        title: val.title,
        path: [val.path[val.path.length - 1]]
      };
    },
    // 关闭other-Tab
    mouseRightKeyClick(item) {
      console.log("mouseRightKeyClick");
      let nextPath;
      let tagList;
      let closeTabList = [],
        time = 50;
      if (item.label === "左关闭") {
        closeTabList = this.tagList.slice(0, this.currentIndex);
        let isContain = closeTabList.some(item => {
          return item.title === this.currentTab.title;
        });
        if (isContain) {
          nextPath = this.tagList[this.currentIndex].path[
            this.tagList[this.currentIndex].path.length - 1
          ];
        }
        tagList = this.tagList.slice(this.currentIndex);
      } else if (item.label === "右关闭") {
        closeTabList = this.tagList.slice(
          this.currentIndex + 1,
          this.tagList.length
        );
        let isContain = closeTabList.some(item => {
          return item.title === this.currentTab.title;
        });
        if (isContain) {
          nextPath = this.tagList[this.currentIndex].path[
            this.tagList[this.currentIndex].path.length - 1
          ];
        }
        tagList = this.tagList.slice(0, this.currentIndex + 1);
      } else if (item.label === "其他关闭") {
        closeTabList = this.tagList
          .slice(0, this.currentIndex)
          .concat(
            this.tagList.slice(this.currentIndex + 1, this.tagList.length)
          );
        nextPath = this.tagList[this.currentIndex].path[
          this.tagList[this.currentIndex].path.length - 1
        ];
        tagList = [this.tagList[this.currentIndex]];
      } else if (item.label === "全部关闭") {
        closeTabList = this.tagList;
        nextPath = "/home/";
        tagList = [];
      }

      let componentNames = closeTabList.map(item => {
        let currPath = item.path[0];
        return currPath
          .split("?")[0]
          .split("/")
          .pop();
      });
      componentNames.forEach(item => {
        this.$store.commit("DEL_KEEPALIVE", { component: item });
      });

      this.tagList = tagList;
      window.sessionStorage.setItem("tagList", JSON.stringify(this.tagList));
      this.$nextTick(() => {
        nextPath ? this.$router.push({ path: nextPath }) : "";
      });

      this.mouseRightKeyFlag = false;
    },

    // tab验证
    currTab(route) {
      let titleArr = this.tagList.map(item => item.title);
      let currRouteTitle = titleArr.includes(route.meta.title);
      if (!currRouteTitle) {
        // tag不存在,添加至第一个
        this.tagList.unshift({
          title: route.meta.title,
          path: [route.fullPath]
        });

        window.sessionStorage.setItem("tagList", JSON.stringify(this.tagList));
      }
    },
    tabCheck(to, from) {
      console.log(to, from, "$route");
      if (to.name === "homePage" || to.name === "invalidpage") {
        this.tagList = [];
      } else {
        this.currentTab = { title: to.meta.title, path: [to.fullPath] };
        let titleArr = this.tagList.map(item => item.title);
        let currRouteTitle = titleArr.includes(to.meta.title);
        //判断是否是新tab
        if (!currRouteTitle) {
          // tag不存在,添加至第一个
          this.tagList.unshift({
            title: to.meta.title,
            path: [to.fullPath]
          });
        } else {
          // 已存在
          if (to.meta.index !== undefined) {
            // 进入子页面,将子页面路径加入数组
            this.tagList.forEach(item => {
              if (item.title === to.meta.title) {
                if (!item.path.includes(to.fullPath)) {
                  item.path.push(to.fullPath);
                } else {
                  let ind = item.path.indexOf(to.fullPath);
                  let path = item.path.slice(0, ind + 1);
                  item.path = path;
                }
              }
            });
          } else {
            // 进入主页面
            // 进入主页面,删除下级页面缓存,清除下级路径
            // 删除下级页面缓存
            let index;
            this.tagList.filter((item, ind) => {
              if (item.path[0] === to.fullPath) {
                index = ind;
                return;
              }
            });
            if (this.tagList[index].path.length > 1) {
              this.tagList[index].path.map((item, ind) => {
                // 默认最后一段为组件名！！！
                if (ind !== 0) {
                  // 从子页面回来更新数据 --->190215 因补货下架单
                  let comp = item.split("/");
                  comp = comp[comp.length - 1].split("?")[0];
                  this.$store.commit("DEL_KEEPALIVE", { component: comp });
                }
              });
              // 清除下级路径
              this.tagList[index].path = [to.fullPath];
            }
          }
        }
      }
      if (this.tagList.length > 10) {
        this.tagList.pop(); //删除最后一个tab
      }
      window.sessionStorage.setItem("tagList", JSON.stringify(this.tagList));
    }
  },
  watch: {
    $route: function(to, from) {
      console.log("watch", to, from);
      this.tabCheck(to, from);
    }
  },
  mounted() {
    console.log("subtabs, mounted");

    // 所有点击过保存的keep-alive的Tab
    let tagList = window.sessionStorage.getItem("tagList");
    if(!tagList){
      this.currTab(this.$route)
    }
    if (tagList && tagList !== "") {
      console.log(JSON.parse(tagList), "json");
      this.tagList = JSON.parse(tagList);
    } else {
      // this.$router.push({ name: "homePage" });
    }
    
    // 当前的路径Tab,激活
    this.currentTab = {
      title: this.$route.meta.title,
      path: [this.$route.fullPath]
    };
  }
};
</script><style lang='less' scoped>
.tabs {
  max-width: 1050px;
  height: 32px;
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
  text-align: center;
  display: inline-block;
  cursor: pointer;
  background: rgba(232, 234, 236, 0.2);
  margin-right: 1px;
}
.tab:hover {
  color: #fff;
  background: rgba(232, 234, 236, 0.46);
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
  color: #226b78;
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