<template>
  <div
    class="navHeader"
    :style="{ left: left }"
    ref="navHeader"
  >
    <!-- :style="{width:autoWidth}" -->
    <div class="left">
      <slot name="left"></slot>
      <template v-if="compName">
        <div class="detailPage">
          <div
            class="icon icon-Home-page"
            @click="changePage('homePage')"
          ></div>
          <div class="icon icon-prePage" @click="changePage('prePage')"></div>
          <Input
            v-model.number="current"
            @keyup.enter.native="changePage('page')"
          ></Input
          >/
          <div class="totle">{{ totle }}</div>
          <div class="icon icon-nextPage" @click="changePage('nextPage')"></div>
          <div class="icon icon-lastPage" @click="changePage('lastPage')"></div>
        </div>
      </template>
    </div>
    <div class="right">
      <div class="refeshSty">
        <fontBtn
          v-if="refeshFlag"
          font-class="refeshSty_icon ivu-icon icon-refresh"
          font-text="刷新(R)"
          ref="ctrl+R"
          @action="refreshFn"
        ></fontBtn>
      </div>
      <slot name="right"></slot>
      <div class="refeshSty">
        <fontBtn
          v-if="refeshFlag"
          font-class="icon-custom"
          font-text="个性化设置"
          @action="cusSet"
        ></fontBtn>
      </div>
    </div>
  </div>
</template>

<script>
import myIndexDb from "@/common/mimixs/indexDB";
export default {
  name: "headBox",
  mixins: [myIndexDb],
  data() {
    return {
      autoWidth: "calc(100% - 214px)",
      left: "214px",
      totle: "1",
      current: "1",
      ids: [],
      data: [],
      searchBtn: null,
      refeshFlag: true
    };
  },
  props: {
    compName:''
  },
  watch: {
    "$parent.$parent.$parent.$parent.$parent.isCollapsed"() {
      //二级菜单
      this.isColl();
    },
    "$parent.$parent.$parent.$parent.$parent.$parent.isCollapsed"() {
      //三级菜单
      this.isColl();
    }
  },
  created() {
    this.getData();
    this.isColl();
  },
  activated() {
    this.getData();
  },
  mounted() {
    if (
      this.$route.meta.index !== undefined &&
      this.$route.name !== "reviewCheckDetail" &&
      this.$route.name !== "outpickingManagementDetail" &&
      this.$route.name !== "shipManagementDetail"&&
      this.$route.name !== "handworkWave"

    ) {
      this.refeshFlag = false;
    }
  },

  methods: {
    isColl() {
      let _isColl =
        this.$parent.$parent.$parent.$parent.$parent.isCollapsed ||
        this.$parent.$parent.$parent.$parent.$parent.$parent.isCollapsed;
      if (_isColl) {
        this.autoWidth = "calc(100% - 64px)";
        this.left = "64px";
      } else {
        this.autoWidth = "calc(100% - 214px)";
        this.left = "214px";
      }
      // console.log(_isColl)
    },
    refreshFn() {
      let nodeList = this.$refs.navHeader.parentElement.querySelectorAll(
        ".ivu-btn"
      );
      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].innerText === "查询") {
          this.searchBtn = nodeList[i];
          break;
        }
      }

      if (this.searchBtn) {
        this.searchBtn.click();
      } else {
        console.log("error refreshFn");
      }
    },
    getData() {
      this.data = [];
      if (this.compName) {
        let query = this.$route.query;
        console.log('query',query)
        if (query.cDetailPage) {
          this.getIndexDBValue(this.compName, query.cDetailPage).then(data => {
            console.log(data)
            this.dataList = data instanceof Array ? data : data.records || [];
            this.totle = this.dataList.length;
            this.dataList.map(item => {
              for (let k in query) {
                if (item[k]) {
                  this.data.push(item[k] + "");
                  this.currentFag = k;
                }
              }
            });
            this.current =
              this.data.indexOf(String(query[this.currentFag])) + 1;
          });
        }
      }
    },
    changePage(data) {
      this.status = true;
      if (data === "homePage") {
        //跳转第一页
        if (this.current != 1) {
          this.current = 1;
          this.$emit("action", this.dataList[this.current - 1]);
        } else {
          this.$message({ type: "warn", content: "已经是第一页" });
        }
      }
      if (data === "prePage") {
        //前翻页
        if (this.current > 1) {
          this.current = this.current - 1;
          this.$emit("action", this.dataList[this.current - 1]);
        } else {
          this.$message({ type: "warn", content: "已经是第一页" });
        }
      }
      if (data === "nextPage") {
        //后翻页
        if (this.current < this.totle) {
          this.current = this.current + 1;
          this.$emit("action", this.dataList[this.current - 1]);
        } else {
          this.$message({ type: "warn", content: "已经最后页" });
        }
      }
      if (data === "lastPage") {
        //跳转最后一页
        if (this.current != this.totle) {
          this.current = this.totle;
          this.$emit("action", this.dataList[this.current - 1]);
        } else {
          this.$message({ type: "warn", content: "已经最后页" });
        }
      }
      if (data === "page") {
        if (!this.current) return;
        let re = /^[1-9]\d*$/;
        if (!re.test(this.current)) {
          this.$message({
            type: "warn",
            content: "请输入大于0的正整数"
          });
          return;
        }
        if (this.current > this.totle) {
          this.$message({
            type: "warn",
            content: "已经超过最大数了，请重新输入"
          });
          return;
        }
        this.$emit("action", this.dataList[this.current - 1]);
      }
    },
    cusSet() {
      let node = this.$refs.navHeader.parentElement.querySelector(
        "#cusSetingOpen"
      );

      if (node) {
        node.click();
      } else {
        console.log("error cusSet");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.navHeader {
  display: flex;
  // width: calc(100% - 214px);
  width: 100%;
  height: 32px;
  padding: 16px;
  background: #ffffff;
  justify-content: space-between;
  align-items: center;
  // position: fixed;
  // top: 32px;
  transition: all 0.2s ease-in-out;
  // left:214px;
  .left {
    display: flex;
    justify-content: flex-start;
    span {
      display: inline-block;
      width: 24px;
      height: 48px;
      margin-right: 8px;
      line-height: 48px;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
    }
    p {
      display: inline-block;
      width: 200px;
      height: 48px;
      font-weight: 600;
      font-size: 14px;
      line-height: 48px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .right {
    display: flex;
    align-items: center;
    div {
      display: flex;
    }
  }
  /deep/.icon-right-arrow {
    margin-right: 8px;
    font-size: 24px;
  }
}
.flight {
  position: fixed;
  top: 64px;
  /*right: 0;*/
  z-index: 9;
}

/deep/ .ivu-breadcrumb,
/deep/ .ivu-breadcrumb-item-separator {
  color: #595959;
}
/deep/ .ivu-breadcrumb > span:last-child {
  color: #226b78;
  font-weight: normal;
}
/deep/ .ivu-breadcrumb {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.detailPage {
  margin-left: 24px;
  display: flex;
  align-items: center;
  height: 32px;
  .ivu-input-wrapper {
    width: 48px;
  }
  .icon {
    font-size: 24px;
  }
}

.refeshSty {
  padding-top: 1px;
  /deep/ .refeshSty_icon {
    margin-top: -2px;
  }
}
</style>
