<template>
  <div class="invalid-wrap">
    <div class="invalid">
      <div class="invalid-container">
        <img src="../assets/img/bg/loginLost_bg.svg" alt>
        <p>登录已过期，请重新登录</p>
        <Button type="default" size="small" @click="reLogin">重新登录</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'invalid',
  data() {
    return {};
  },
  created() {
    setTimeout(() => {
      this.reLogin();
    }, 3000);
  },
  methods: {
    reLogin() {
      this.$router.replace({
        path: "/login"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-layout-content {
  margin-top: 8px !important;
}
.invalid-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  .invalid {
    flex: 1;
    margin: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    .invalid-container {
      text-align: center;
      p {
        color: #8c8c8c;
        margin: 16px 0;
      }
      .ivu-btn {
        border-color: #d9d9d9;
      }
    }
  }
}
</style>

