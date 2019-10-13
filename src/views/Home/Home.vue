<template>
  <div class="layout" ref="home">
    <Layout>
      <Sider hide-trigger>
        <template>
          <div
            slot="trigger"
            :style="{width:isCollapsed?'64px':'214px'}"
            class="ivu-layout-sider-trigger"
            :class="{'icon-left-arrow_all':!isCollapsed,'icon-right-arrow_all':isCollapsed}"
            @click="isCollapsed=!isCollapsed"
          ></div>
        </template>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  name: "home",
  components: {},
  props: {},
  data() {
    return {};
  }
};
</script>
<style lang='less' scoped>
.layout {
  height: 100%;
  width: 100%;
  .ivu-layout-has-sider {
    height: 100%;
  }
}
</style>