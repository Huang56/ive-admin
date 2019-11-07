<template>
    <div class="container" style="height:calc(100% - 16px);">
        <div class="left">
            <div class="data-board">
                <p class="firstpage-title">数据看板</p>
                <div>
                    <div class="column">
                        <Card :bordered="false" class="bgcolor-blue1" style="width:50%;margin-left:10px">
                            <p class="item-title">今日访客<span class="image"><i class="ivu-icon icon-into-warehouse"></i></span></p>
                            <p class="data"><span class="big-font">{{queryByTotalData.billQty}}</span>/{{queryByTotalData.skuQty}}</p>
                        </Card>
                        <Card :bordered="false" class="bgcolor-org1" style="width:50%;margin:0 10px">
                            <p class="item-title">访客总数<span class="image image-org"><i class="ivu-icon icon-outbound"></i></span></p>
                            <p class="data"><span class="big-font">{{output.qty}}</span>/{{output.skuQty}}</p>
                        </Card>
                    </div>
                    <div class="column">
                        <Card :bordered="false" class="bgcolor-blue3" style="width:25%;margin-left:10px">
                            <p class="item-title">点赞</p>
                            <p class="data"><span class="big-font">{{queryByUnqcData.billQty}}</span>/{{queryByUnqcData.skuQty}}</p>
                        </Card>
                        <Card :bordered="false" class="bgcolor-blue1" style="width:25%;margin-left:10px">
                            <p class="item-title">Clearlove7</p>
                            <p class="data"><span class="big-font">{{queryByUninstockData.billQty}}</span>/{{queryByUninstockData.skuQty}}</p>
                        </Card>
                        <Card :bordered="false" class="bgcolor-org3" style="width:25%;margin-left:10px">
                            <p class="item-title">Html</p>
                            <p class="data"><span class="big-font">{{output.pickQty}}</span>/{{output.pickSkuQty}}</p>
                        </Card>
                        <Card :bordered="false" class="bgcolor-org1" style="width:25%;margin:0 10px">
                            <p class="item-title">CSS</p>
                            <p class="data"><span class="big-font">{{output.recheckQty}}</span>/{{output.recheckSkuQty}}</p>
                        </Card>
                    </div>
                    <div class="column">
                        <Card :bordered="false" class="bgcolor-blue1" style="width:25%;margin-left:10px">
                            <p class="item-title">NODE</p>
                            <p class="data"><span class="big-font">{{queryByTransferOnWayData.billQty}}</span>/{{queryByTransferOnWayData.skuQty}}</p>
                        </Card>
                        <Card :bordered="false" class="bgcolor-blue1" style="width:25%;margin-left:10px">
                            <p class="item-title">Javascript</p>
                            <p class="data"><span class="big-font">{{queryByInstockData.billQty}}</span>/{{queryByInstockData.skuQty}}</p>
                        </Card>
                        <Card :bordered="false" class="bgcolor-org1" style="width:25%;margin-left:10px">
                            <p class="item-title">mongoose</p>
                            <p class="data"><span class="big-font">{{output.deliverQty}}</span>/{{output.deliverSkuQty}}</p>
                        </Card>
                        <Card :bordered="false" class="bgcolor-org1" style="width:25%;margin:0 10px">
                            <p class="item-title">React</p>
                            <p class="data"><span class="big-font">{{output.shippedQty}}</span>/{{output.shippedSkuQty}}</p>
                        </Card>
                    </div>
                </div>
            </div>
            <div class="Shortcut-operation">
                <p class="firstpage-title">
                    <span>快捷操作</span>
                    <span class="edit" @click="edit"><i class="ivu-icon icon-edit"></i>编辑</span>
                </p>
                <div class="menu-item">
                    <div class="item-box" v-for="(item,index) in myFavourite" :key="index" @click="pushRouter(item.menuPath)">
                        <i class="ivu-icon" :class="item.menuIcon"></i>
                        <p>{{item.menuTitle}}</p>
                    </div>
                </div>
            </div>
        </div>
        <Modal
        title="快捷功能管理"
        v-model="showEdit"
        class-name="vertical-center-modal">
            <Input v-model.trim="searchModule" placeholder="搜索模块" @on-enter="search" />
                <ul class="notice-table">
                    <li class="notice-header">
                        <span>模块名称（上下拖动排序）</span>
                        <span>操作</span>
                    </li>
                    <draggable v-model="data" class="draggable btndraggable">
                        <li v-for="(item,index) in data" :key="item.id" class="notice-table-data">
                            <span>{{item.menuTitle}}</span>
                            <span>
                                <i v-if="item.showAdd" class="icon icon-editAdd" @click="add(item)"></i>
                                <i v-if="!item.showAdd" class="icon icon-editMminus" @click="minus(item, index)"></i>
                            </span>
                        </li>
                    </draggable>
                </ul>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
// import {
//   outputStatistics,
//   queryByTotal,
//   queryByUnqc,
//   queryByUninstock,
//   queryByTransferOnWay,
//   queryByInstock
// } from '@/api/firstPage.js'
import draggable from "vuedraggable";
// import { userAdd, userGet } from "@/api/home/home";
export default {
    components: { draggable },
    data(){
        return {
            output:{},
            queryByTotalData:{},
            queryByUnqcData:{},
            queryByUninstockData:{},
            queryByTransferOnWayData:{},
            queryByInstockData:{},
            showEdit:false,
            searchModule:'',
            tHeader:[
                {
                    title:'模块名称（上下拖动排序）',
                    key:'moduleName'
                },
                {
                    title:'操作',
                    key:'action',
                    align:'center',
                }
            ],
            data:[],
            data_copy:[],
            myFavourite:[],
        }
    },
    created(){
        this.getMenuData()

        outputStatistics().then(
            res => {
                if (~~res.code === this.resCode.successCode) {
                    this.output = res.data
                } else {
                    this.$message({
                        type: 'warn',
                        content: res.msg ? res.msg : '后台错误'
                    })
                }
            }
        ).catch(e => {
          console.log(e)

          this.$message({
            type: 'error',
            content: '请求错误或超时，请重试！'
          })
        })
        queryByTotal().then(
            res => {
                if (~~res.code === this.resCode.successCode) {
                    this.queryByTotalData = res.data
                } else {
                    this.$message({
                        type: 'warn',
                        content: res.msg ? res.msg : '后台错误'
                    })
                }
            }
        ).catch(e => {
          console.log(e)

          this.$message({
            type: 'error',
            content: '请求错误或超时，请重试！'
          })
        })
        queryByUnqc().then(
            res => {
                if (~~res.code === this.resCode.successCode) {
                    this.queryByUnqcData = res.data
                } else {
                    this.$message({
                        type: 'warn',
                        content: res.msg ? res.msg : '后台错误'
                    })
                }
            }
        ).catch(e => {
          console.log(e)

          this.$message({
            type: 'error',
            content: '请求错误或超时，请重试！'
          })
        })
        queryByUninstock().then(
            res => {
                if (~~res.code === this.resCode.successCode) {
                    this.queryByUninstockData = res.data
                } else {
                    this.$message({
                        type: 'warn',
                        content: res.msg ? res.msg : '后台错误'
                    })
                }
            }
        ).catch(e => {
          console.log(e)

          this.$message({
            type: 'error',
            content: '请求错误或超时，请重试！'
          })
        })
        queryByTransferOnWay().then(
            res => {
                if (~~res.code === this.resCode.successCode) {
                    this.queryByTransferOnWayData = res.data
                } else {
                    this.$message({
                        type: 'warn',
                        content: res.msg ? res.msg : '后台错误'
                    })
                }
            }
        ).catch(e => {
          console.log(e)

          this.$message({
            type: 'error',
            content: '请求错误或超时，请重试！'
          })
        })
        queryByInstock().then(
            res => {
                if (~~res.code === this.resCode.successCode) {
                    this.queryByInstockData = res.data
                } else {
                    this.$message({
                        type: 'warn',
                        content: res.msg ? res.msg : '后台错误'
                    })
                }
            }
        ).catch(e => {
          console.log(e)

          this.$message({
            type: 'error',
            content: '请求错误或超时，请重试！'
          })
        })

        userGet({userId:JSON.parse(window.sessionStorage.getItem("warehouse")).userId}).then(res => {
            if (~~res.code === this.resCode.successCode) {
                this.myFavourite = Array.isArray(JSON.parse(res.data))
                    ? JSON.parse(res.data)
                    : [];
                    console.log(this.myFavourite)
                this.myFavourite.map( ele => {
                    this.data.map( item => {
                        if(ele.id === item.id){
                            ele.menuIcon = item.menuIcon
                        }
                    })
                })
            }
        })
    },
    watch:{
        myFavourite(newVal, oldVal){
           clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.userAdd();
            }, 1000);
        },
        data(newVal, oldVal){
            let myFavourite = []
            newVal.map(item => {
                if(!item.showAdd){
                    myFavourite.push(item)
                }
            })
            this.myFavourite = myFavourite
        }
    },
    methods:{
        getMenuData(){
            let menu = JSON.parse(sessionStorage.getItem('menuAuth'))
            this.addMenuIcon(menu)
            this.data_copy = this.data.concat('')
        },
        userAdd() {
            userAdd({
                userId: JSON.parse(window.sessionStorage.getItem("warehouse")).userId,
                content: Array.isArray(this.myFavourite) ? JSON.stringify(this.myFavourite): []
            }).then(res => {}).catch(e => {});
        },
        pushRouter (path) {
            this.$router.push({name: path})
        },
        edit () {
            this.data = []
            this.data_copy = []
            this.showEdit = true
            this.searchModule = ''
            this.getMenuData()
            let newArr = []
            this.data.map(ele =>{
                let count = 0;
                this.myFavourite.map(item => {
                    if(ele.id === item.id){
                        item.showAdd = false
                    }else{
                        count ++
                    }
                })
                if(count === this.myFavourite.length){
                    newArr.push(ele)
                }
            })
            this.data = this.myFavourite.concat(newArr)
        },
        addMenuIcon (data) {
            let that = this
            data.map((item) => {
            let icon = item.menuIcon
                find(item, icon)
            })
            function find (item, icon) {
                if (item.children.length) {
                    item.children.map((ele, index) => {
                        if (icon) { ele.menuIcon = icon }
                        find(ele, ele.menuIcon)
                    })
                } else {
                    item.showAdd = true
                    that.data.push(item)
                }
            }
        },
        // checkAll (){
        //     this.showNoticeAll = true
        // },
        search () {
            let that = this
            if(this.searchModule){
                let searchArr = []
                this.data.map(item => {
                    if(item.menuTitle.indexOf(that.searchModule) !== -1){
                        searchArr.push(item)
                    }
                })
                this.data = searchArr
            }else{
                this.data = this.data_copy
            }
            console.log(this.data)
        },
        minus (item, index) {
            item.showAdd = true
            this.myFavourite.splice(index, 1)
        },
        add (item){
            item.showAdd = false
            this.myFavourite.push(item)
        },
        sizeChange() {
            // this.cacheRegion.limit = arguments[0];
            // this.searchForm.limit = arguments[0]; //记住条数
            // this.Search(this.cacheRegion)
        },
        currentChange() {
            //翻页
            // this.cacheRegion.page = arguments[0];
            // this.Search(this.cacheRegion)
            // this.page = arguments[0];
            // this.getDataList(this.cacheRegion);
        },
    }
}
</script>

<style scoped lang="less">
/deep/.vertical-center-modal .ivu-modal-header{
    background: #f2f2f2!important;
}
/deep/.ivu-layout-content{
    margin-top:0
}
.container{
    display: flex;
    justify-content:space-between;
    background:#ececec;
    // min-width: 1200px;

}
.data-board, .Shortcut-operation{
    background: #fff;
    border-radius: 4px;
}
.Shortcut-operation{
    margin-top: 8px;
    flex:1
}
.left{
    display: flex;
    flex:750;
    flex-direction: column;
}
.right{
    flex: 452;
    background: #fff;
    margin-left: 8px;
    border-radius: 4px;
    height:100%
}
.menu-item{
    display: flex;
    flex-wrap: wrap;
    margin:17px 16px;
    .item-box{
        text-align: center;
        background: #F5F5F5;
        border-radius: 4px;
        width:112px;
        height:112px;
        margin:0 8px 8px 0;
        color:#595959;
        cursor: pointer;
        .ivu-icon{
            font-size:40px;
            margin-top:26px;
        }
        .ivu-icon:before{
            color:#0ec1af;
        }
    }
    .item-box:hover{
        background: #0ec1af;
        color:#fff;
        .ivu-icon:before{
            color:#fff;
        }
    }
}
.firstpage-title{
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    padding: 0px 16px;
    font-weight: bold;
    color: #262626;
    border-bottom: 1px solid #e8e8e8;
    .edit{
        font-weight: 100;
        float: right;
        font-size: 12px;
        color:#595959;
        cursor: pointer;
    }
}
.icon-outbound,.icon-into-warehouse{
    font-size: 24px;
    margin:8px 0 0 8px;
    .firstpage-cont{
        overflow-x: hidden;
        padding-bottom: 17px;
        box-sizing:border-box;
    }
}
.icon-into-warehouse::before{
    color:#0ec1af;
}
.icon-outbound::before{
    color:#f08519;
}
.column{
    display:flex;
    justify-content:space-between;
    margin:8px 0;
    .image{
        display: inline-block;
        width:40px;
        height:40px;
        background: rgba(14,193,175,0.4);
        border-radius: 50%;
        float: right;
    }
    .image-org{
        background: rgba(240,133,25,0.4)
    }
}
.item-title{
    color:#595959;
}
.big-font{
    font-size:48px;
    color:#595959;
}
.data{
    font-size:16px;
    color:#000;
}
.notice{
    cursor: pointer;
    margin:0 16px 0 22px;
    font-size: 14px;
    color:#595959;
    display:flex;
    align-items: center;
    margin-top:17px;
    .red-point{
        display:inline-block;
        background: #F11B35;
        width:8px;
        height: 8px;
        border-radius: 50%;
        margin-right:6px;
    }
    .desc{
        flex:1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.notice:hover{
    text-decoration: underline;
    color:#0ec1af
}
.bgcolor-blue1{
    background: rgba(15,193,175,0.1);
}
.bgcolor-blue3{
    background: rgba(15,193,175,0.3);
}
.bgcolor-org1{
    background: rgba(240,133,25,0.1);
}
.bgcolor-org3{
    background: rgba(240,133,25,0.3);
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal{
        top: 0;
    }
}
.notice-all{
    display: flex;
    height: 390px;
    flex-direction: column;
    flex-wrap: wrap;
}
.notice-table{
    border:1px solid #e8e8e8;
    margin-top:24px;
    .icon{
        font-size:24px;
        cursor: pointer;
    }
}
.notice-header{
    color:#262626;
    font-weight: bold;
    line-height:40px;
    background:#f5f5f5;
}
.notice-table-data{
    line-height:32px;
}
.btndraggable{
    max-height:270px;
    overflow: auto;
}
.notice-header > span:nth-child(1),.notice-table-data > span:nth-child(1){
    display: inline-block;
    width:70%;
    border-right:solid 1px #e8e8e8;
    padding-left:6px;
}
.notice-header > span:nth-child(2),.notice-table-data > span:nth-child(2){
    display: inline-block;
    width:30%;
    text-align: center;
}
.notice-table-data:nth-child(2n){
    background:#f5f5f5;
}
.icon-editMminus::before{
    color:#F11B35;
}
::-webkit-scrollbar{
    width:0;
}
.icon-edit{
    margin-right: 5px;
    font-size: 16px;
}
</style>
