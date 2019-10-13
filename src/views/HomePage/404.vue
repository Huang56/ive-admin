<template>
  <div class="abnormal">
    <!--<img src="../../assets/img/404.svg" alt="404" width="516" height="160">-->
    <div class="bj">404...</div>
  </div>
</template>

<script>
export default {
  name: 'lose404',
  data () {
    return {}
  },
  created(){
    setTimeout(()=>{
      this.reLogin()
    },2000)
  },
  methods: {
    reLogin () {
      this.$router.replace({
        path: '/login'
      })
    }
  }
}
</script>

<style lang="less"  scoped>
.abnormal {
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  .bj {
    display: inline-block;
    width: 516px;
    height: 160px;
    // background-image: url('../../assets/img/404.svg');
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    &:before {
      content: '抱歉，你访问的页面不存在';
      display: inline-block;
      width: 100%;
      height: 18px;
      position: absolute;
      bottom: -32px;
      left: 0;
      font-size: 12px;
      color: #333744;
      text-align: center;
    }
  }

  p {
    position: absolute;
    top: 50%;
    left: 0;
    font-size: 12px;
    color: #333744;
  }
}
</style>
