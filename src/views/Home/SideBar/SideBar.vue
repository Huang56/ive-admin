<template>
  <Sider collapsible :collapsed-width="64" v-model="isCollapsed">
    <div class="searchMenu">
      <span
        class="icon-search searchIcon"
        v-if="isShow"
        ref="searchIcon"
        :class="{hiddenSearchIcon: hiddenSearchIcon}"
      ></span>
      <Select
        v-model="menuSelect"
        :title="onQueryChangeValue"
        @on-clear="menuSearchClear"
        ref="menuSelect"
        filterable
        clearable
        placeholder="搜索"
        :class="isCollapsed?'menuSelectSty_narrow':'menuSelectSty'"
        @on-change="menuChange"
        @on-query-change="onQueryChange"
      >
        <Option
          class="selectOption"
          v-for="item in menuList"
          :value="item.menuPath"
          :key="item.menuPath"
        >{{item.menuTitle}}</Option>
      </Select>
    </div>
    <!-- width-menu -->
    <template v-if="!isCollapsed">
      <Menu :active-name="activeName" theme="dark" width="auto" :class="menuitemClasses">
        <template>
          <MenuItem name="myIndex" class="myIndex" :to="{ name: 'firstPage' }">
            <i style="margin-right: 16px" class="ivu-icon icon-index"></i>
            <span>我的首页</span>
          </MenuItem>
        </template>
        <template v-for="(oneMenu,$index1) in routeMenus">
          <template v-if="oneMenu.children && oneMenu.children.length !==0">
            <Submenu :name="oneMenu.id" class="menuItem" :key="$index1">
              <template slot="title">
                <i :class="oneMenu.menuIcon" class="ivu-icon"></i>
                <span>{{ oneMenu.menuTitle }}</span>
              </template>

              <!-- 二级菜单 -->
              <draggable>
                <template v-for="(twoMenu,$index2) in oneMenu.children">
                  <template v-if="twoMenu.children&&twoMenu.children.length!==0">
                    <Submenu :name="twoMenu.id" :key="$index2" class="ignore-elements level3">
                      <template slot="title">
                        <i :class="twoMenu.menuIcon" class="ivu-icon"></i>
                        <span>{{ twoMenu.menuTitle }}</span>
                      </template>
                      <!-- 三级菜单 -->
                      <draggable v-model="twoMenu.children">
                        <MenuItem
                          v-if="threeMenu.index === undefined"
                          :name="threeMenu.id"
                          v-for="(threeMenu,$index3) in twoMenu.children"
                          :key="$index3"
                          :to="{ name: threeMenu.menuPath }"
                        >{{threeMenu.menuTitle}}</MenuItem>
                      </draggable>
                    </Submenu>
                  </template>
                  <!-- 只有二级菜单 -->
                  <template v-else>
                    <template v-if="twoMenu.index === undefined">
                      <MenuItem
                        class="level2"
                        :name="twoMenu.id"
                        :key="$index2"
                        :to="{ name: twoMenu.menuPath }"
                      >{{twoMenu.menuTitle}}</MenuItem>
                    </template>
                  </template>
                </template>
              </draggable>
            </Submenu>
          </template>
        </template>
      </Menu>
    </template>
    <!-- narrow-menu -->
    <template v-else>
      <!-- 第一级 -->
      <template>
        <template>
          <div
            class="narrowMenu"
            :class="activeIndex=== -2 ? 'narrowMenu_active' : ''"
            @click.prevent.stop="e=>{activeIndex=-1;narrowMenuClick(1,myFavourite,-1,e)}"
          >
            <i class="ivu-icon icon-index"></i>
            <div>我的首页</div>
          </div>
        </template>
      </template>
      <div ref="narrowMenu" v-for="(oneMenu,$index1) in routeMenus" :key="oneMenu.id">
        <!-- {{oneMenu.path}} -->
        <template v-if="oneMenu.children&&oneMenu.children.length!==0">
          <template v-if="oneMenu.index === undefined">
            <div
              class="narrowMenu"
              :class="activeIndex===$index1 ? 'narrowMenu_active' : ''"
              @click.prevent.stop="e=>{activeIndex=$index1;narrowMenuClick(1,oneMenu,$index1,e)}"
            >
              <i :class="oneMenu.menuIcon" class="ivu-icon"></i>
              <div>{{ oneMenu.menuTitle }}</div>
            </div>
          </template>
        </template>
        <template v-else>
          <div
            class="narrowMenu"
            :class="activeIndex===$index1 ? 'narrowMenu_active' : ''"
            @click="activeIndex=$index1;$router.push({ name: oneMenu.menuPath })"
          >
            <i :class="oneMenu.menuIcon" class="ivu-icon"></i>
            <div>{{ oneMenu.menuTitle }}</div>
          </div>
        </template>
      </div>
      <div
        class="narrowMenu_side"
        v-clickoutside="handleClose"
        :style="`top:${narrowMenu_side_top}px;`"
        ref="narrowMenu_side"
        v-show="narrowMenu_side_show"
      >
        <ul>
          <li
            v-for="(twoMenu,$index2) in narrowMenu_side_list"
            :key="twoMenu.id"
            class="narrowMenu_side_list"
          >
            <template v-if="twoMenu.children&&twoMenu.children.length!==0">
              <!-- class="narrowMenu_side_active" -->
              <div @click="e=>narrowMenuClick(2,twoMenu,$index2,e)" ref="secondNav">
                <div
                  class="side_title side_title_collaps side_title_hover"
                  :class="!narrowMenu_show['show'+$index2] ? '' : 'narrowMenu_active'"
                >
                  <span>{{ twoMenu.menuTitle }}</span>

                  <i
                    :class="!narrowMenu_show['show'+$index2] ? '' : 'side_title_collaps_icon_rotate narrowMenu_active'"
                    class="ivu-icon ivu-icon-ios-arrow-down ivu-menu-submenu-title-icon side_title_collaps_icon"
                  ></i>
                </div>
              </div>

              <ul
                v-if="narrowMenu_show['show'+$index2]"
                :style="`height:${side_collaps_ul_height}px`"
                class="side_collaps_ul"
                ref="side_collaps_ul"
              >
                <li
                  v-for="(threeMenu,$index3) in narrowMenu_side2_list"
                  :key="threeMenu.id"
                  @click="shortNavClick($index3,threeMenu)"
                  ref="narrowMenu_Active"
                >
                  <div>{{ threeMenu.menuTitle }}</div>
                </li>
              </ul>
            </template>

            <template v-else>
              <!-- <template v-if="twoMenu.index === undefined"> -->
              <template>
                <div
                  class="side_title side_title_hover"
                  @click="secondNavClick(twoMenu,$index2)"
                  ref="secondNav"
                >
                  <div>{{ twoMenu.menuTitle }}</div>
                </div>
              </template>
            </template>
          </li>
        </ul>
      </div>
      <!-- menu-slider -->
    </template>
    <!-- 点击关闭 -->
    <template>
      <div
        slot="trigger"
        :style="{width:isCollapsed?'64px':'200px'}"
        class="ivu-layout-sider-trigger"
        :class="{'icon-left-arrow_all':!isCollapsed,'icon-right-arrow_all':isCollapsed}"
        @click="isCollapsed=!isCollapsed"
      ></div>
    </template>
  </Sider>
</template>
<style lang="less" scoped>
</style>
<script>
// mock数据
import {menu as basicInfoMenu} from '../../../components/basicInfo/routemenu'
import {menu as TaskManageMenu} from '../../../components/TaskManage/routemenu'
import {menu as OutStorageManageMenu} from '../../../components/OutStorageManage/routemenu'
let routeMenus = [
  TaskManageMenu,
  basicInfoMenu,
  OutStorageManageMenu
];

import draggable from "vuedraggable";
export default {
  name: "sideBar",
  components: {
    draggable
  },
  props: {},
  data() {
    return {
      isCollapsed: false,
      menuList: [], // siderMenu-start
      isShow: true, //搜索框
      menuSelect: "",
      hiddenSearchIcon: false,
      onQueryChangeValue: "",
      activeIndex: "",
      activeName: "", //默认高亮菜单
      routeMenus: [], //当前用户的菜单
      myFavourite: [],
      // 侧边menu
      narrowMenu_side_show: true,
      narrowMenu_side_top: 0,
      narrowMenu_side_height: 0,
      side_collaps_ul_height: 0,
      narrowMenu_side_list: [], //侧边子菜单
      narrowMenu_side2_list: [] //侧边孙级菜单
    };
  },
  methods: {
    handleClose() {
      console.log("handleClose");
    },
    menuSearchClear() {
      console.log("menuSearchClear");
    },
    menuChange() {
      console.log("menuChange");
    },
    onQueryChange() {
      console.log("onQueryChange");
    },
    menuitemClasses() {
      console.log("menuitemClasses");
    },
    // narrowMenu
    narrowMenuClick(str, item, index, evt) {
      console.log("narrowMenuClick");
      console.log(str, item, index, evt);
      if (str === 1) {
        if (!item) return;
        this.narrowMenu_side_list = item.children || item;
        let winHeight = window.innerHeight; //浏览器高度
        let evtDom = null;
        // 返回元素相对于视口的位置
        let narrowMenu_side = this.$refs.narrowMenu_side.getBoundingClientRect();
        let i = 0;
        console.log(this.narrowMenu_side_list.length);
        // 计算二级菜单的高度
        this.narrowMenu_side_height =
          (this.narrowMenu_side_list.length - i) * 64;
        this.$refs.narrowMenu_side.style.height =
          this.narrowMenu_side_height + "px";

        //获取点击事件的坐标
        if (evt.target === "narrowMenu") {
          evtDom = evt.target;
        } else {
          evtDom = evt.target.parentNode;
        }
        // 判断边界
        if (this.narrowMenu_side_height > winHeight) {
          this.narrowMenu_side_height = parseInt((winHeight / 3) * 2);
          this.$refs.narrowMenu_side.style.height =
            this.narrowMenu_side_height + "px";
        }

        if (evtDom.offsetTop > this.narrowMenu_side_height) {
          if (
            winHeight - this.narrowMenu_side_height - evtDom.offsetTop >
            this.narrowMenu_side_height
          ) {
            this.narrowMenu_side_top = evtDom.offsetTop;
          } else {
            this.narrowMenu_side_top =
              evtDom.offsetTop - this.narrowMenu_side_height + 64;
          }
        } else {
          this.narrowMenu_side_top = evtDom.offsetTop;
          if (this.narrowMenu_side_height + evtDom.offsetTop > winHeight) {
            this.$refs.narrowMenu_side.style.height =
              winHeight - evtDom.offsetTop - 64 + "px";
          }
        }
      }

      this.narrowMenu_side_show = true;
    },
    secondNavClick() {
      console.log("secondNavClick");
    },
    // 异步获取菜单
    getMenuAuth() {
      let getMenuPromise = new Promise((resolve, reject) => {
        let menuJson = window.sessionStorage.getItem("menuAuth");
        if (menuJson) {
          this.routeMenus = JSON.parse(menuJson);
        } else {
          this.routeMenus = routeMenus;
          window.sessionStorage.setItem(
            "menuAuth",
            JSON.stringify(this.routeMenus)
          );
          resolve(this.routeMenus);
        }
      });
    }
  },
  created() {
    // 获取菜单
    this.getMenuAuth();
  }
};
</script><style lang='less' scoped>
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
// narrow-menu-start
.narrowMenu {
  width: 64px;
  height: 64px;
  text-align: center;
  // color: #fff;
  color: #d5e2e5;
  cursor: pointer;

  /deep/ i {
    margin-right: 0;
    padding-top: 10px;
  }
}
.narrowMenu_active {
  background: #0ec1af;
  color: #fff !important;
}

.narrowMenu:hover {
  background-color: #0ec1ff;
  color: #fff;
}

// narrowMenu_side-start
.narrowMenu_side {
  position: fixed;
  left: 66px;
  width: 140px;
  text-align: center;
  z-index: 5000;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #3c7c88;
  .side_title {
    width: 140px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    color: #d5e2e5;
    cursor: pointer;
  }
  .side_title_hover:hover {
    background: #0ec1af;
    color: #fff;
  }
  .side_title_collaps {
    line-height: 64px;
    position: relative;
  }
  .side_title_collaps_icon {
    position: absolute;
    top: 25px;
    right: 20px;
    font-size: 14px;
    color: #fff;
    text-align: right;
    transform: rotate(-90deg);
  }

  .side_title_collaps_icon_rotate {
    transform: rotate(-180deg);
  }

  .narrowMenu_side_list {
    position: relative;
  }

  .narrowMenu_side_active {
    border-left: 4px solid #00e2cc;
    background-color: rgba(255, 255, 255, 0.16);
    color: #fff !important;
  }

  .side_collaps_ul {
    animation: ul_animation 0.3s linear;
    opacity: 1;
    overflow: hidden;
    li {
      height: 64px;
      line-height: 64px;
      color: #d5e2e5;
    }
    li:hover {
      border-left: 4px solid #00e2cc;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }
    @keyframes ul_animation {
      0% {
        height: 0;
      }
      100% {
        height: 200px;
      }
    }
  }
}
// throw
.icon-right-arrow_all,
.icon-left-arrow_all {
  text-align: center;
  vertical-align: middle;
  line-height: 48px;
  font-size: 24px;
  &:before {
    display: inline;
    vertical-align: middle;
    color: #fff;
  }
}
</style>