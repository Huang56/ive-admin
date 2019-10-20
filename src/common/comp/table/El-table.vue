  <template>
<div id='xj_table' ref="eltable"><!-- :height="autoHeight"   :style="{'height':autoHeight + 'px'}"  element-loading-spinner="icon-help"   v-loading="tableLoading"   :highlight-current-row="radios"    @current-change="currentChange"-->
  <el-table

    element-loading-text="拼命加载中"
    :data="tableData"
    style="width: 100%"
    :class="(radio||selectSameColObj&&Object.keys(selectSameColObj).length>0)?'_hideAllCheckBox':''"
    :height="autoHeight"
    :max-height="maxHeight"
    border
    ref="multipleTable"
    :cell-class-name="tBodyClassName"
    :header-cell-class-name="headerCellClassName"
    :empty-text="empty"
    :highlight-current-row="radios"
    @select="select"
    @select-all="selectAll"
    @selection-change="handleSelectionChange"
    @cell-dblclick="cellDblclick"
    @row-dblclick="rowDblclick"
    @row-click="rowClick"
    @cell-click="cellClick"
    @sort-change="sortable"
    @cell-mouse-enter="cellMouseEnter"
  >

    <template v-for="(field, fieldIndex) in tHeader" >
      <el-table-column v-if="hasCallback(field)"
        :align="field.align"
        :sortable="field.sortable"
        :fixed="field.fixed"
        :type="field.type"
        :key="fieldIndex"
        :prop="field.prop"
        :label="field.label"
        :width="field.width"
        :formatter="formatterColumn"
        :class-name="cellClassName(field)"
        >
        <template slot-scope="scope">
          <template v-if="!field.cellClick">
            <span v-html="formatterColumn(scope.row,field)" ></span>
          </template>
          <template v-if="field.cellClick">
            <span v-html="formatterColumn(scope.row,field)" @click.stop.prevent = "spanClick(scope.row,field)" class="cellClick"></span>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-else-if="field.cellClick "
        :align="field.align"
        :sortable="field.sortable"
        :fixed="field.fixed"
        :type="field.type"
        :key="fieldIndex+'only'"
        :prop="field.prop"
        :label="field.label"
        :width="field.width"
        :class-name="cellClassName(field)"
        >
        <template  slot-scope="scope">

          <span @click.stop.prevent = "spanClick(scope.row,field)" @dblclick="dblclick=false" class="cellClick">
            {{scope.row[field.prop]}}
          </span>
        </template>
      </el-table-column>

      <el-table-column v-else
        :align="field.align"
        :sortable="field.sortable"
        :fixed="field.fixed"
        :type="field.type"
        :key="fieldIndex+'only'"
        :prop="field.prop"
        :label="field.label"
        :width="field.width"
        :class-name="cellClassName(field)"
        >
      </el-table-column>

    </template>

    <el-table-column v-if="buttonItem!=undefined"
      align="center"
      fixed="right"
      :label="handleTitle || '操作'"
      :width="handleWidth || 120">
      <template slot-scope="scope" >
        <template v-for="(iBtn,i) in buttonItem">
          <el-button
            :key="i"
            @click.native.prevent.stop="lookDetail(scope.$index,iBtn.action)"
            class="handleBtnTab"
            type="text"
            :title="iBtn.title"
            size="small">
            <i  :class="iBtn.icon" style="font-size:24px"></i>
          </el-button>
        </template>
      </template>
    </el-table-column>

  </el-table>

  <div class="el-loading-mask" style="background-color: hsla(0,0%,100%,.9);" v-show="tableLoading">
    <div class="el-loading-spinner">
      <img src="@/assets/img/logoMovie2.gif" alt=""/>
      <p class="el-loading-text">拼命加载中</p>
    </div>
  </div>


</div>
</template>

<script>

  export default {
    name:'Eltable',
    data() {
      return {
        autoHeight:'360',
        multipleSelection: [],
        empty:'空',
        timer:null,
        radios:this.radio,
        canvas:null,
        ctx:null,
        sources:[],
        buttonItem:[]
      }
    },
    props:{
      funcList:null,
      tableData:null,
      tHeader:null,
      itemButtons:null,
      maxHeight:null,
      handleWidth:null,
      tableLoading:null,
      handleTitle:null,
      radio: {
        type: Boolean,
        default: false
      },
      lazyLoad: {
        type: Boolean,
        default: false
      },
      align: {
        type: String,
        default: 'left'
      },
      selectSameColObj:{
        type: Object,
        default: function(){
          return {}
        }
      }
    },
    created(){
      this.buttonItem = this.DEEP_COPY(this.itemButtons);
      let arr = [];
      if(this.funcList&&this.funcList.length){
        arr = this.buttonItem.filter(item => {
          if(item.code && this.funcList.indexOf(item.code) !== -1){
            return true;
          }else if(item.code === undefined){
            return true;
          }else if(item.code && this.funcList.indexOf(item.code) === -1){
            return false;
          }
        })
        this.buttonItem = arr;
      }
    },
    mounted(){
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        // 获取窗口高度
        let Height = document.documentElement.clientHeight || document.body.clientHeight
        // 获取table距离窗口的高度
        let top = document.getElementById("xj_table").offsetTop

        let page = document.getElementById("pagingBox") //分页

        let btn = document.getElementsByClassName("max_btn") //带表格的新添修改页按钮

        if (top<=48) {return}
        let aHeight = Height - top

        if (aHeight<200) return
        if (page === null) {
          this.autoHeight = aHeight-72
        }else{
          let pageHeight = page.offsetHeight //分页高度
          let aHeight = Height - top
          this.autoHeight = aHeight-pageHeight-72 //减去分页的高度及头部64及底部margin值8
        }

        if (btn[0] !== undefined) {

          this.autoHeight = aHeight-112

        }

      },0)
      if(this.lazyLoad){
        let dom = this.$refs.eltable
        let domSon = dom.getElementsByClassName('el-table__body-wrapper')[0]
        console.log(domSon)
        domSon.addEventListener('scroll', this.handleScroll);
      }
      if (this.buttonItem===undefined) {return}
      this.buttonItem.forEach((item,i)=>{
        if (item.icon==="el-icon-edit" || item.icon==="icon-edit") {
          this.buttonItem[i].icon = "icon-edit-list"
        }
        if (item.icon==="el-icon-view") {
          this.buttonItem[i].icon = "icon-see-list"
        }
        if (item.icon==="el-icon-delete" || item.icon==="icon-delete" ) {
          this.buttonItem[i].icon = "icon-edit-delect"
        }
      })


    },
    watch:{
      tableLoading () {
        if (this.tableLoading===true) {
          this.empty=' '
        }
      },
      tableData(){
        if (this.tableData.length===0) {
          this.empty='暂无数据'
        }
        // this.selectAll(this.tableData)
      },
      itemButtons(){
        this.buttonItem = this.itemButtons
      }
    },

    methods: {
      handleScroll(){//触发滚动
        // let el = document.getElementsByClassName("el-table__body-wrapper")
        console.log(event,event.target.offsetTop,event.target.scrollTop,event.target.offsetHeight,event.target.scrollHeight)
        // console.log(event.target.scrollTop,1111)
        if(event.target.scrollTop>0&&event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight){
          this.$emit('action',{action:'scroll'})
        }
        //scrollTop为滚动条在Y轴上的滚动距离。
        //clientHeight为内容可视区域的高度。
        //scrollHeight为内容可视区域的高度加上溢出（滚动）的距离。
        // for (var i = 0; i < el.length; i++) {
        //   console.log(el[i].scrollTop,el[i].offsetHeight,el[i].scrollHeight,244)

        //   if (el[i].scrollTop==0) {return} //无滚动条时返回

        //   if(el[i].scrollTop+el[i].offsetHeight>=el[i].scrollHeight){
        //     this.$emit('action',{action:'scroll'})
        //   }
        // }

        // if (el.scrollTop==0) {return} //无滚动条时返回
        // if(el.scrollTop+el.offsetHeight>=el.scrollHeight){
        //   this.$emit('action',{action:'scroll'})
        // }
      },
      hasCallback (item) {//判断是否有callback
        return item.callback ? true : false
      },
      formatterColumn(row,column, ){
        // console.log(row,column,)
        if(typeof(column.callback) !== 'function') {
         return
        }
        return column.callback(row)
      },

      tBodyClassName({row, column, rowIndex, columnIndex}){
        // console.log({row, column, rowIndex, columnIndex})
        // if(column.label=='操作' ){//|| column.label==this.handleTitle
        //   return 'el-handle'
        // }

      },
      cellClassName(field){  //一列的类名
        // if (field.cellClick) {
        //   return 'cellClick'
        // }

      },
      headerCellClassName({row, column, rowIndex, columnIndex}){

        // if(column.label=='操作' ){//|| column.label==this.handleTitle
        //   return 'el-handle'
        // }

      },
      select(selection, row){
        if (this.radio) {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(row);
          this.$refs.multipleTable.setCurrentRow(row);
          this.$emit('action',{action:'radio',item:this.multipleSelection})
        }else if(this.selectSameColObj&&Object.keys(this.selectSameColObj).length>0){
          this.selectSameColFn(row,'radioClick')
        }
      },
      selectAll(all){ //全选
        // let rows = this.tableData
        // console.log(this.tableData)
        // this.$refs.multipleTable.clearSelection();

      },
      handleSelectionChange(val) {  //当选择项发生变化时会触发该事件
        this.multipleSelection = val;
        if(!(this.radio||Object.keys(this.selectSameColObj).length>0)){
          this.$emit('action',{action:'radio',item:this.multipleSelection})
        }
      },
      rowClick(row){ // 单击行
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{ //计时器解决和双击的冲突
          // console.log("单击")
          if (row) { //单击行选中
            if (this.radio) {
              this.$refs.multipleTable.clearSelection();
              this.$refs.multipleTable.toggleRowSelection(row);
              this.$emit('action',{action:'radio',item:this.multipleSelection})
            }else if(this.selectSameColObj&&Object.keys(this.selectSameColObj).length>0){
              this.selectSameColFn(row,'rowClick')
            }else{
              this.$refs.multipleTable.toggleRowSelection(row);
            }
            this.oldCurrentRow = row
          }
          this.$emit('action',{action:'click',item:row})
        },300)

      },
      cellClick(row, column, cell, event){ //单击单元格
        // console.log(event.target,224)
        //this.$emit('action',{action:'cellClick',item:row,column:column})

      },
      cellDblclick(row, column){//双击单元格实际执行双击行
        if (this.radios!==true) {
          clearTimeout(this.timer);
          if (column.label!=="操作" && column.label!==this.handleTitle) {
            this.$emit('action',{action:'detail',item:row})
          }
          this.$refs.multipleTable.setCurrentRow(this.oldCurrentRow);
        }
      },
      rowDblclick(row, event){ // 双击行
        // console.log(event.target,201)
        // clearTimeout(this.timer);
        // if (event.target.children.length>=2) {return}//操作栏

        // this.$emit('action',{action:'detail',item:row})
      },

      lookDetail(i,action){ // 详情
        this.$emit('action',{action:action,index:i})
      },

      sortable({ column, prop, order }){ //column, event  { column, prop, order }
        this.$emit('action',{action:"sort" , prop, order })
      },
      cellMouseEnter(row, column, cell){  //鼠标移入单元格显示title
        cell.setAttribute("title", cell.innerText);
      },
      spanClick(row,field){
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{ //计时器解决和双击的冲突
          this.$emit('action',{action:'cellClick',item:row,field:field})
        },300)
      },

      selectSameColFn (row,type) {
        // 已选中的数据选中切换,行点击和复选框点击相反处理
        // if(type === 'radioClick'){
        //   let radioFlag = true
        //   // 不存在选中数据中则清空
        //   for(let x = 0; x < this.multipleSelection.length; x ++){
        //     if(this.multipleSelection[x] === row){
        //       radioFlag = false
        //       break
        //     }
        //   }
        //   if(radioFlag){
        //     this.$refs.multipleTable.clearSelection()
        //     this.$emit('action',{action:'sameCol',item:this.multipleSelection})
        //     return
        //   }
        // }else{
        //   // 存在选中数据中则清空
        //   for(let x = 0; x < this.multipleSelection.length; x ++){
        //     if(this.multipleSelection[x] === row){
        //       this.$refs.multipleTable.clearSelection()
        //       this.$emit('action',{action:'sameCol',item:this.multipleSelection})
        //       return
        //     }
        //   }
        // }
        // 已选中数据清空状态
        // if(this.multipleSelection.length>0){
        //   this.$refs.multipleTable.clearSelection()
        // }
        let isValue = row[this.selectSameColObj.type],isSameColArr = [],flag = false,filterKey = '',filterVal = ''
        // 取出二级筛选的key和value
        if(this.selectSameColObj.childs&&this.selectSameColObj.childs.length>0){
          flag = true
          for(let j = 0; j < this.selectSameColObj.childs.length;j++){
            if(this.selectSameColObj.childs[j].type === isValue){
              filterKey = this.selectSameColObj.childs[j].key
              break
            }
          }
          filterVal = row[filterKey]
        }
        console.log(filterKey,1,filterVal)
        // 筛选遍历
        for(let i = 0; i < this.tableData.length; i ++){
          if(this.tableData[i][this.selectSameColObj.type] === isValue){
            if(flag&&filterKey){
              if(this.tableData[i][filterKey] === filterVal){
                isSameColArr.push(this.tableData[i])
              }
            }else{
              isSameColArr.push(this.tableData[i])
            }
          }
        }
        this.$refs.multipleTable.setCurrentRow(row)
        let selectRow = row
        isSameColArr.forEach(row => {
          if(selectRow == row&&type === 'radioClick'){
            // radio选中与行选中状态相反
          }else{
            this.$refs.multipleTable.toggleRowSelection(row)
          }
        })
        this.$emit('action',{action:'sameCol',item:this.multipleSelection})
      },
      // onload(){//初始化
      //   console.log(2)
      //   // this.sources = [];

      //   //构建图片序列数据
      //   for(var i=0;i<=30;i++){

      //     this.sources[i]='@/assets/img/logo5/000'+i+'.png';
      //   }
      //   this.canvas = document.getElementById("animation_canvas");
      //   console.log(this.canvas,317)
      //   this.canvas.width = 80;
      //   this.canvas.height = 80;

      //   this.ctx = this.canvas.getContext("2d");
      //   //ctx.globalAlpha=0.5
      //   //执行图片预加载，加载完成后执行main
      //   this.loadImages(this.sources,(images)=>{
      //       this.playImages(images,1000)
      //   });
      // },
      // //播放图片动画
      // playImages(images,duration){
      //   // console.log(3,images)
      //   var imageNum=images.length;
      //   var imageNow=0;
      //   setInterval(()=>{
      //   //      ctx.fillStyle="rgba(0,0,0,0)";
      //       this.ctx.clearRect(0,0,80,80);
      //       this.ctx.fillRect(0, 0, 80, 80);
      //       // console.log(this.ctx.drawImage,340)
      //       this.ctx.drawImage(images[imageNow], 0, 0, 80, 80);
      //       imageNow++;
      //       if(imageNow>=imageNum){
      //           imageNow=0;
      //       }
      //   },duration/imageNum)
      // },
      // //预加载序列图片
      // loadImages(sources,callback){
      //   console.log(1,sources,callback)
      //   var loadedImages = 0;
      //   var numImages = 0;
      //   var images=[];

      //   numImages=sources.length;
      //   for (var i=0,len=sources.length;i<len;i++) {
      //       images[i] = new Image();

      //       //当一张图片加载完成时执行
      //       console.log("kkkkk",images[i])
      //       images[i].onload = ()=>{
      //         console.log("kk")
      //         //当所有图片加载完成时，执行回调函数callback
      //         if (++loadedImages >= numImages) {
      //           callback(images);
      //         }
      //       };
      //       //把sources中的图片信息导入images数组
      //       images[i].src = sources[i];
      //       console.log(images[i].src)

      //   }
      // },


    },
  }
</script>
<style lang="less">
  #xj_table{
    overflow: auto;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    .iconButton{
      border: 1px solid;
      position: absolute;
      z-index: 99;
      top:0;
    }
    .el-table__empty-block{
      width: 100% !important;
    }
  }

  #xj_table .el-table{
    /*border-radius: 8px;*/
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border:0;
    overflow:auto;
  }
  #xj_table .el-table thead{
    font-size: 16px !important;

  }
  #xj_table .el-table thead th{
    padding: 0;
  }

  #xj_table .el-table thead th:hover{
    background: #ffe7bd;
  }
  #xj_table .el-table thead th .cell{
    min-height: 39px;
    max-height: 39px;
    line-height: 39px;
    color: #262626 !important;
    padding:0 8px;
  }

  #xj_table .el-table .warning-row {
    background: #f5f5f5;
  }

  #xj_table .el-table .success-row {
    background: #e8e8e8;
  }
  #xj_table .el-table .el-table__body{
    display:inline-table;
  }
  #xj_table .el-table tbody tr {
    max-height:32px;
  }

  #xj_table .el-table tbody tr:nth-child(2n-1){
    background: #f5f5f5;
  }
  #xj_table .el-table tbody tr:nth-child(2n){
    background: #fff;
  }
  #xj_table .el-table tbody tr td{
    padding: 0 !important;

  }
  #xj_table .el-table tbody tr td .cell{
    height: 31px;
    line-height: 31px;
    color: #595959;
    padding:0 8px;
  }
  #xj_table .el-table .el-button{
    display: inline-block;
    border-radius: 50%;
    width: 24px !important;
    height: 24px !important;
    padding:0;
    line-height: 22px;
    margin-top: 4px;

  }
  #xj_table .el-table .el-button span{
    width: 24px !important;
    height: 24px !important;
  }
  #xj_table .el-table .el-table-column--selection{
    background: #fff;
  }
  #xj_table .el-table .el-table-column--selection .cell{
    text-align: center;
  }
  #xj_table .el-table .el-checkbox__inner{
    width: 16px !important;
    height: 16px !important;
  }
  #xj_table .el-table .el-checkbox__inner::after{
    left: 5px !important;
  }

  .el-handle{
    border-right: 0 !important;
  }
  .el-handle .cell{
    text-align:center;
  }
  .el-table::before{
    height:0;
  }

  .el-table__fixed-right::before, .el-table__fixed::before{
    height:0;
  }
  .el-table--border::after, .el-table--group::after{
    width:0;
  }
  .handleBtnTab:hover{
    // background: #000 !important;
    opacity:0.5;
  }
  #xj_table .el-table thead th:nth-last-child(2),#xj_table .el-table tbody tr td:nth-last-child(1){
    border-right:0;
  }
  #xj_table .el-table thead th:nth-last-child(1){
    border-right:0;
    text-align:center;
  }
  #xj_table .el-table__body tr.current-row > td{
    background: #FFE7BD;
  }
  .cellClick{
    color:rgb(24, 144, 255) !important;
    cursor: pointer;
  }
  .cellClick:hover{
    color:#F08519 !important;
  }
  .el-loading-spinner{
    top:40%;
  }
  .el-loading-spinner img{
    width:80px;
    height:80px;
  }
  .el-table--border td,.el-table--border th{
    border-color:transparent;
  }
   thead .is-wrap > div.cell{
    word-break: break-all;
    line-height: 1.6em !important;
    vertical-align: middle;
    text-align: center;
  }
</style>
