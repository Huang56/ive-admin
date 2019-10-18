<template>
  <div class="tabs" v-if="tagList.length > 0">
    <div
      v-for="(item,index) in tagList"
      @contextmenu.prevent="e=>mouseRightKey(e,item,index)"
      class="tab"
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
  name: "subtabs",
  components: {},
  props: {},
  data() {
    return {
      tagList: [
        { title: "我的首页", path: ["/home/firstPage"] },
        { title: "菜单一", path: ["/home/firstPage"] }
      ],
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
      mouseRightKeyTimer: null
    };
  },
  methods: {
    // 关闭当前Tab
    closeTab() {
      console.log("closeTab");
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
    selectTab() {
      console.log("selectTab");
    },
    // 关闭other-Tab
    mouseRightKeyClick() {
      console.log("mouseRightKeyClick");
      this.mouseRightKeyFlag = false;
    }
  },
  mounted() {
    console.log("subtabs, mounted");
    // 所有点击过保存的keep-alive的Tab
    let tagList = window.sessionStorage.getItem("tagList");
    if (tagList && tagList !== "") {
      console.log(JSON.parse(tagList), "json");
      this.tagList = JSON.parse(tagList);
    } else {
      this.$router.push({ name: "homePage" });
    }

    // 当前的路径Tab
    this.currentTab = {
      title: this.$route.meta.title,
      path: [this.$route.fullPath]
    };
  },
  watch: {
    $route: function(to, from) {
      console.log(to, from, "$route");
    }
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