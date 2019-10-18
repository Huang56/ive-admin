
<template>
  <div class="layout">
    <div :style="{minHeight: '100vh'}" class="ivu-layout ivu-layout-has-sider">
      <sideBar/>
      <Layout>
        <Header>
          <subtabs></subtabs>
          <div class="logout">
            <span
              class="fullScreen"
              @keyup.esc="changeIcon"
              @click="toggleFullScreen"
              :title="fullScreen ? '进入全屏' : '退出全屏'"
              style="height: 18px;"
            >
              <Icon
                :custom="fullScreen ? 'icon-full-Screen' : 'icon-exit-Screen'"
                :style="{ 'font-size': '14px' }"
              />
            </span>
            <span class="user" @click="logout">
              <img src="../../assets/img/icon/tool/User_icon.svg" alt>
              <div class="userName">用户名：asdsd</div>
            </span>
          </div>
        </Header>
        <Content class="content">
          <keep-alive >
            <router-view ref="content"></router-view>
          </keep-alive>
        </Content>
      </Layout>
    </div>
  </div>
</template>
<script>
import subtabs from "./../../components/subtabs";
import sideBar from "./SideBar/SideBar";
import menuList from "../../router/menu"; // siderMenu

export default {
  components: {
    subtabs,
    sideBar
  },
  data() {
    return {
      fullScreen: true
    };
  },
  computed: {
    menuitemClasses: function() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    toggleFullScreen(e) {
      let el = document.documentElement;
      var isFullscreen =
        document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen;
      console.log(isFullscreen, "asdsad");
      if (!isFullscreen) {
        //进入全屏,多重短路表达式
        (el.requestFullscreen && el.requestFullscreen()) ||
          (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
          (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
          (el.msRequestFullscreen && el.msRequestFullscreen());
        this.fullScreen = false;
        console.log(this.fullScreen, "asdsad");
        let _this = this;
        window.addEventListener("resize", this.changeIcon, false);
      } else {
        //退出全屏,三目运算符
        document.exitFullscreen
          ? document.exitFullscreen()
          : document.mozCancelFullScreen
          ? document.mozCancelFullScreen()
          : document.webkitExitFullscreen
          ? document.webkitExitFullscreen()
          : "";
        this.fullScreen = true;
        console.log("changeIcon", this.fullScreen);
        let _this = this;
        window.removeEventListener("resize", this.changeIcon, false);
      }
    },
    changeIcon() {
      let isFullscreen =
        document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen;
      if (isFullscreen) {
        this.fullScreen = false;
        console.log("changeIcon", this.fullScreen);
      } else {
        this.fullScreen = true;
        console.log("changeIcon", this.fullScreen);
        window.removeEventListener("resize", this.changeIcon, false);
      }
    },
    logout() {
      this.$router.push({
        path: "/login"
      });
    },
    // menu-start
    //search
    menuSearchClear() {
      console.log("menuSearchClear");
    },
    menuChange() {
      console.log("menuChange");
    },
    onQueryChange() {
      console.log("onQueryChange");
    }
  }
};
</script>

<style scoped lang='less'>
// loyout
.ivu-layout {
  display: flex;
  flex-direction: column;
  flex: auto;
  background: #f5f7f9;
}

.ivu-layout.ivu-layout-has-sider {
  flex-direction: row;
}
/*header style*/
.ivu-layout-header {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 32px;
  line-height: 32px;
  padding: 0 16px 0 0;
}
.logoImg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  height: 108px;
  cursor: pointer;
}

.logout img {
  width: 24px;
  height: 24px;
}
.logout {
  display: flex;
  justify-content: space-around;
  height: 32px;
  align-items: center;
  line-height: 32px;
  float: right;
  span {
    color: #fff;
    font-weight: 900;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    line-height: 15px;
    text-align: center;
    cursor: pointer;
    margin: 0 10px;
    img {
      width: 24px;
      height: 24px;
    }
  }
  .env {
    background-color: #f0d319;
    font-size: 10px;
    color: #2b566b;
  }
  .loginWarehouse {
    color: #2b566b;
    background-color: #9bf578;
    font-size: 10px;
  }

  .help {
    position: relative;
    width: 24px;
    height: 24px;
    .helpNav {
      width: 112px;
      position: absolute;
      z-index: 99;
      background-color: #2b566b;
      border-radius: 4px;
      display: none;
      top: 26px;
      li {
        height: 24px;
        list-style-type: none;
        line-height: 24px;
        display: flex;
        align-items: center;
        text-align: center;
        i {
          font-style: normal;
        }
      }
      li::before {
        color: #fff;
        padding: 4px 8px 4px 16px;
        font-size: 16px;
      }
      .select01,
      .select03,
      li:hover {
        background-color: #0ec1af;
      }
      .select01,
      li:nth-child(1):hover {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
      }
      .select03,
      li:nth-child(3):hover {
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      img {
        width: 16px;
        height: 16px;
        margin: 4px 8px 4px 16px;
      }
      .select {
        background-color: #0ec1af;
      }
    }
  }
  .help:hover .helpNav {
    display: block;
  }
  .set {
    width: 24px;
    height: 24px;
  }
  .user {
    width: 24px;
    height: 24px;
    position: relative;
    .userName {
      position: absolute;
      right: -26px;
      width: 112px;
      display: none;
      z-index: 999;
      background-color: #515a6e;
      border-radius: 4px;
      height: 24px;
      line-height: 24px;
    }
  }
  .user:hover .userName {
    display: block;
  }
}

.layout-con {
  height: 100%;
  width: 100%;
}
</style>