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
          <MenuItem name="myIndex" class="myIndex" :to="{ name: 'home' }">
            <i style="margin-right: 16px" class="ivu-icon icon-index"></i>
            <span>我的首页</span>
          </MenuItem>
        </template>
        <template>
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-paper"/>内容管理
            </template>

            <!-- 二级菜单 -->
            <draggable>
              <template>
                <template>
                  <MenuItem name="1-1">文章管理</MenuItem>
                  <MenuItem name="1-2">评论管理</MenuItem>
                  <MenuItem name="1-3">举报管理</MenuItem>
                </template>
              </template>
            </draggable>
          </Submenu>
        </template>
        <template>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-people"/>用户管理
            </template>
            <!-- 三级菜单 -->
            <draggable>
              <Submenu name="2-1">
                <template slot="title">
                  <Icon type="ios-people"/>详细用户管理
                </template>
                <draggable>
                  <MenuItem name="2-1-1">文章管理</MenuItem>
                  <MenuItem name="2-1-2">评论管理</MenuItem>
                  <MenuItem name="2-1-3">举报管理</MenuItem>
                </draggable>
              </Submenu>

              <Submenu name="2-2">
                <template slot="title">
                  <Icon type="ios-people"/>内容管理
                </template>
                <!-- 三级菜单 -->
                <draggable>
                  <MenuItem name="2-2-1">文章内容</MenuItem>
                  <MenuItem name="2-2-2">评论内容</MenuItem>
                  <MenuItem name="2-1-3">举报内容</MenuItem>
                </draggable>
              </Submenu>
            </draggable>
          </Submenu>
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
      <template>
        <div class="narrowMenu" :class="isCollapsed? 'narrowMenu_active' : ''">
          <i class="ivu-icon icon-index"></i>
          <div>第一级</div>
        </div>
      </template>
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
import draggable from "vuedraggable";
export default {
  name: "sideBar",
  components: {
    draggable
  },
  props: {},
  data() {
    return {
      isCollapsed: true,
      menuList: [], // siderMenu-start
      isShow: true, //搜索框
      menuSelect: "",
      hiddenSearchIcon: false,
      onQueryChangeValue: "",
      activeIndex: "",
      activeName: "", //默认高亮菜单
      routes: []
    };
  },
  methods: {
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
    }
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