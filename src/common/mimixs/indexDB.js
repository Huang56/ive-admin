export default {
  data (){
    return {
      IndexDbAjax:null,    //对应每个模块里面的请求接口
    }
  },
  methods:{
    //删库到跑路
    clearIndexDB (){
      this.$localforage.clear().then(()=>{
        // console.log('所有数据重置成功');
      } ).catch(()=>{
        // console.log('所有数据重置失败');
      });
    },
    //重置  当前 key  name
    removeIndexDB (name,fn){
      return this.$localforage.removeItem(name).then(fn)
    },
    //存值  name当前组件name  curr存入的页码  size 页码最大条数
    setIndexDBValue (name,newArr,curr,size){
       this.getIndexDBValue(name).then(data=>{
        data[curr-1] = newArr;
         this.$localforage.setItem(name,data).then(()=>{
           // console.log(`${name}存储成功55555`);
         },err=> {} );
      },err=>{
        // console.log(err,'取值函数错误');
      });
    },

    //取值  name当前组件name  curr存入的页码  size 页码最大条数
    async getIndexDBValue (name,curr,size){
      let arr = [];
      await this.$localforage.getItem(name).then(value=>{
        arr = value || [];
      },err=>{});
      if(curr){
        return arr[curr-1];
      }else {
        return arr;
      }
    },

    //预请求  name 当前组件name 做 key   curr 预存入的页码  total 页面最大数 params  请求参数
    prereguisitesIndexDb (name,curr,total,params={}, flag = false){
      // flag true 存data false 存 data.records 两种模式
      this.getIndexDBValue(name,curr).then(x=>{
        if(!x){
          if(curr<=total){
            params.page = curr;
            this.IndexDbAjax(params).then(item=>{
              if(item.code==this.resCode.successCode){
                const dataList = flag ? item.data : item.data.records || item.data.list
                this.setIndexDBValue(name,dataList,curr);  //存入预请求表格数据
              }
            },()=>{
              this.$message('warn','列表预请求失败');
            })
          }
        }
      })
    }
  }
};
