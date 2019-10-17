
<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem name="1-1">
            <Icon type="ios-navigate"></Icon>
            <span>Option 1</span>
          </MenuItem>
          <MenuItem name="1-2">
            <Icon type="search"></Icon>
            <span>Option 2</span>
          </MenuItem>
          <MenuItem name="1-3">
            <Icon type="settings"></Icon>
            <span>Option 3</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
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
        <Content :style="{padding: '0 16px 16px'}">
          <Breadcrumb :style="{margin: '16px 0'}">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Components</BreadcrumbItem>
            <BreadcrumbItem>Layout</BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <div style="height: 600px">Content</div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import subtabs from "./../../componments/subtabs";
export default {
  components:{
    subtabs
  },
  data() {
    return {
      fullScreen: true,
      isCollapsed: false
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
    }
  }
};
</script>

<style scoped lang='less'>
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
      background-color: #2b566b;
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
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>