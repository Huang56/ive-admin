<template>
    <div id="pagingBox" class="clearfix pagingBox" ref="pagingBox">
      <Page
        background
        class="elemeContent"
        ref="elemeContent"
        v-if="showPaging!==false"
        :pager-count="5"
        :current="current"
        @on-page-size-change="pageSizeChange"
        @on-change="pageCurrChange"
        :page-size-opts="sizeArr||[10,20,50,100]"
        :page-size="size||10"
        show-total
        show-elevator
        show-sizer
        :total="total||0">
      </Page>
      <div class="pageInfo" v-if="showInfoBtn||false">
        <span class="icon-Statistics iconBtn" title="查看统计" @click="loadInfo"></span>
        <p class="extraInfo" v-if="infoShow&&selfData.length<=8">
          <span class="infoSpanFa" v-for="(item ,i) in selfData"><span class="infoSpanT">{{item.label}}:</span><span class="tdInfo" :title="item.value">{{item.value}}</span></span>
        </p>
      </div>
  </div>
</template>
<!--showInfoBtn:true 是否显示统计-->
<!--infoData   ：统计数组-->
<!--infolabel：label//显示的label-->
<!--infovalue：value//显示的value-->

<!--由于空间限制，目前最多显示8个-->

<script>
  export default {
    name:'pageing',
    props: {
      showPaging: {
        type: Boolean,
        default: true
      },
      showInfoBtn: {
        type: Boolean,
        default: false
      },
      infolabel: {
        type: [String, Number]
      },
      infovalue: {
        type: [String, Number]
      },
      infoData: {
        type: Array
      },
      sizeArr: {
        type: Array,
        default: () => [10,20,50,100]
      },
      size: {
        type: Number,
        default: 20
      },
      current: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        default: 0
      }
    },
    // props:['showInfoBtn','sizeArr','size','current','total','infoData','infolabel','infovalue','showPaging'],
    data () {
      return {
        selfData:[],
        infoShow:true
      }
    },
    watch: {
      infoData: {
        handler: function() {
          if(this.infoData){
            this.selfData = this.infoData.map(item=>{
              return {label:item[this.infolabel],value:item[this.infovalue]}
            })
          }
        },
        deep: true
      }
    },
    mounted (){
        if(this.infoData){
          this.selfData = this.infoData.map(item=>{
            return {label:item[this.infolabel],value:item[this.infovalue]}
          })
        }
    },
    methods:{
      pageSizeChange (data) {
        this.$emit('sizeChange',data)
      },
      pageCurrChange (data) {
        this.$emit('currentChange',data)
      },
      loadInfo () {
        this.infoShow = !this.infoShow
        this.$emit('countClick',this.infoShow)
      }
    }
  }
</script>

<style lang="less" scoped>
.pagingBox{
      height:40px;
      background:#fff;
      border-radius:0 0 8px 8px;
      display:flex;
      flex-direction:row-reverse;
      .elemeContent{
        display:flex;
        align-items:center;
        margin-right:16px;
      }
      .pageInfo{
        flex:1;
        display:flex;
      	height:100%;
        overflow:hidden;
        .iconBtn{
        	cursor:pointer;
          height:64px;
          line-height:64px;
          width:64px;
          font-size:22px;
          text-align:center;
        }
        .iconBtn:hover{
          color:#F08519;
        }
        .extraInfo{
          flex:1;
          display:flex;
          align-items:center;
          flex-wrap:wrap;
          .infoSpanFa{
            height: 28px;
            line-height: 28px;
            width: 25%;
            .tdInfo{
              flex:1;
              overflow:hidden;
              text-overflow:ellipsis;
              text-indent:8px;
              color: #0EC1AF;
            }
          }
        }
      }
      /deep/.ivu-page-item a{
        margin:0;
      }
    }
</style>
