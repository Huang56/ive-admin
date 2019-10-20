<template>
  <Button :loading='loading' @click="actionFn">
    <i :class="fontClass"></i>
    <span>{{fontText}}</span>
  </Button>
</template>

<script>
export default {
  name: 'fontBtn',
  data () {
    return {
      fontName: ''
    }
  },
  props: {
    loading:{
      type: Boolean,
      default: false
    },
    fontClass: {
      type: String,
      default: 'add'
    },
    fontText: {
      type: String,
      default: '点击'
    }
  },
  methods: {
    actionFn () {
      this.$emit('action')
    }
  }
}
</script>

<style lang="less" scoped>
Button{
  display: flex;
  min-width: 44px;
  height: 16px;
  font-size: 12px;
  color: #262626;
  justify-content: space-between;
  align-items: center;
  margin-left: 16px !important;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0 !important;
  &:hover{
    color: #0EC1AF;
     border: none;
     background: none;
  }

  i{
    font-size: 16px;
  }
  span{
    margin-left: 4px;
  }
}
.ivu-btn[disabled] {
    background: none;
  }
</style>
