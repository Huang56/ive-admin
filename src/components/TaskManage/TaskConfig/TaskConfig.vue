<template>
	<div class="big-container">
		<headBox>
			<Breadcrumb slot="left">
				<BreadcrumbItem>任务管理</BreadcrumbItem>
				<BreadcrumbItem>任务配置</BreadcrumbItem>
			</Breadcrumb>
			<div slot="right">
				<fontBtn font-class='icon-add' font-text='新增(O)' @action="Add" ref="ctrl+O"></fontBtn>
			</div>
		</headBox>
		<div class="container">
			<Form :model="searchForm" :label-width="88" class="search-form">
        <!-- <div class="searchForm"> -->
        <row :gutter="16">
          <Col :md="4" :lg="3">
            <FormItem label="任务类型">
              <Select v-model.trim="searchForm.qcGroup" clearable placeholder="请选择">
                <Option v-for="(item,$index) in selectList.t_qc_group" :value="item.itemValue" :key="$index" v-if="item.status===1">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :md="4" :lg="3">
            <FormItem label="允许转派否">
              <Select v-model.trim="searchForm.erer" clearable placeholder="请选择">
                <Option value="是" label="是"></Option>
                <Option value="否" label="否"></Option>
                <!-- <Option v-for="(item,$index) in selectList.t_qc_group" :value="item.itemValue" :key="$index" v-if="item.status===1">{{item.itemName}}</Option> -->
              </Select>
            </FormItem>
          </Col>


          <Col :md="4" :lg="3" v-first>
  					<FormItem :label-width="0" >
              <Button type="primary" @click="Search(searchForm)"><i class="icon-search">查询</i></Button>
              <Button @click="searchForm={}"><i class="icon-reset">重置</i></Button>
  	        </FormItem>
          </Col>
        </row>
	    	<!-- </div> -->
    	</Form>
		</div>

		<div class="table container">
      <p class="title">任务配置列表</p>

			<!-- <wmsTable :tHeader="tHeader" :tData="tData" :loading="tableLoading"></wmsTable> -->
      <canvasTable :tHeader="tHeader" :tData="tData" :loading="tableLoading" :itemButtons='itemButtons'  @action="handleTable" />
       <pageing
        :current="pageData.current"
        :total="pageData.total"
        :size="pageData.size"
        :sizeArr="[10,20,50,100]"
        @sizeChange="sizeChange"
        @currentChange="currentChange">
      </pageing>
		</div>
    <!-- 新增弹窗 -->
    <Modal
      v-model.trim="addOrEditModal"
      :title="modalTitle"
      @on-visible-change="onVisibleChange('modalForm')"
      draggable
      >
      <Form :model="modalForm" :label-width="88" ref="modalForm" :rules="rules">
        <row :gutter="16">
          <Col :span="12">
            <FormItem label="任务类型" prop="qcGroup">
              <Select v-model.trim="modalForm.qcGroup" placeholder="请选择">
                <Option v-for="(item,$index) in selectList.t_qc_group" :value="item.itemValue" :key="$index" v-if="item.status===1">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="状态" prop="qcGroup">
              <Select v-model.trim="modalForm.qcGroup" placeholder="请选择">
                <Option v-for="(item,$index) in selectList.t_qc_group" :value="item.itemValue" :key="$index" v-if="item.status===1">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="可指派人" prop="person">
              <Input v-model.trim="modalForm.person" search @on-search="iptSearch('person')" placeholder="请输入" :disabled="codeDisabled"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="被指派组" prop="groups">
              <Input v-model.trim="modalForm.groups" search @on-search="iptSearchGroup" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="允许转派否" prop="qcStandType">
              <Select v-model.trim="modalForm.qcStandType" placeholder="请选择">
                <Option v-for="(item,$index) in selectList.qc_stand_type" :value="item.itemValue" :key="$index">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="可转派人" prop="redeploy">
              <Input  v-model.trim="modalForm.redeploy" search @on-search="iptSearch('redeploy')" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="自动释放时间" prop="sourcePosition">
              <Input v-model.trim="modalForm.sourcePosition" placeholder="请输入">
                <Select v-model="modalForm.select2" slot="append" style="width: 40px">
                  <Option value="m">分</Option>
                  <Option value="H">时</Option>
              </Select>
              </Input>
            </FormItem>
          </Col>
        </row>
      </Form>
      <div slot="footer">
        <Button type="primary" :disabled="modal_loading" @click="Save" v-shortcutKey:S>保存(S)</Button>
        <Button type="text" @click="offModal" v-shortcutKey:Q>取消(Q)</Button>
      </div>
    </Modal>
    <!-- 指派人列表弹窗 -->
    <Modal
      v-model.trim="designate"
      :title="designateTitle"
      @on-visible-change="onVisibleChange('designateForm')"
      draggable
      :z-index="9999"
      :scrollable="true"
      :width="BIG_MODEL + 'px'"
      >
      <!-- :width="BIG_MODEL + 'px'" -->
      <!-- 人员 -->
      <Form :model="designateForm" :label-width="88" ref="designateForm" class="search-form" v-if="designateTitle!=='请选择工作组'">
        <row :gutter="16">
          <Col :span="8">
            <FormItem label="人员类型" >
              <Select v-model.trim="designateForm.qcGroup" placeholder="请选择">
                <Option v-for="(item,$index) in selectList.t_qc_group" :value="item.itemValue" :key="$index" v-if="item.status===1">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="岗位" >
              <Select v-model.trim="designateForm.qcGroup" placeholder="请选择">
                <Option v-for="(item,$index) in selectList.t_qc_group" :value="item.itemValue" :key="$index" v-if="item.status===1">{{item.itemName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="人员编号" >
              <Input v-model.trim="designateForm.qcStandNo" placeholder="请输入" :disabled="codeDisabled"></Input>
            </FormItem>
          </Col>
        </row>
        <row :gutter="16">
          <Col :span="8">
            <FormItem label="人员名称" >
              <Input v-model.trim="designateForm.qcStandName" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col :span="8" v-first>
            <FormItem :label-width="0" >
              <Button type="primary" @click="Search()"><i class="icon-search">查询</i></Button>
              <Button @click="designateForm={}"><i class="icon-reset">重置</i></Button>
            </FormItem>
          </Col>
        </row>
      </Form>
      <!-- 工作组 -->
      <Form :model="designateForm" :label-width="88" ref="designateForm" class="search-form" v-else>
        <row :gutter="16">

          <Col :span="8">
            <FormItem label="工作组编码" >
              <Input v-model.trim="designateForm.qcStandNo" placeholder="请输入" :disabled="codeDisabled"></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="工作组名称" >
              <Input v-model.trim="designateForm.qcStandName" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="组长" >
              <Input v-model.trim="designateForm.qcStandName" placeholder="请输入"></Input>
            </FormItem>
          </Col>
          <Col :span="8" v-first>
            <FormItem :label-width="0">
              <Button type="primary" @click="Search()"><i class="icon-search">查询</i></Button>
              <Button @click="designateForm={}"><i class="icon-reset">重置</i></Button>
            </FormItem>
          </Col>
        </row>
      </Form>
      <div class="container">
        <!-- <wmsTable :tHeader="tHeader" :tData="tData" :loading="tableLoading"></wmsTable> -->
        <canvasTable :height="360" :tHeader="tHeader" :tData="designateTD" :loading="tableLoading"  @action="handleTablePerson" v-show="designateTitle==='请选择指派人员'"/>

        <canvasTable :height="360" :tHeader="designateGroupTH" :tData="designateGroupTD" :loading="tableLoading"  @action="handleTableGroup"  v-show="designateTitle==='请选择工作组'"/>

        <canvasTable :height="360" :tHeader="redeployTH" :tData="redeployTD" :loading="tableLoading"  @action="handleTableRedeploy" v-show="designateTitle==='请选择转派人员'"/>
        <pageing
          :current="pageData.current"
          :total="pageData.total"
          :size="pageData.size"
          :sizeArr="[10,20,50,100]"
          @sizeChange="sizeChange"
          @currentChange="currentChange">
        </pageing>
      </div>
      <div slot="footer">
        <Button type="primary" :disabled="modal_loading" @click="confirm()" v-shortcutKey:S>确认(S)</Button>
        <Button type="text" @click="designate=false" v-shortcutKey:O>取消(Q)</Button>
      </div>
    </Modal>

	</div>
</template>
<script>
  // import {getListQC,deleteQC,addQC,updateQC,validateQC} from '@/api/basicInfo/warehouseMessage/platformManage/request'

	export default{
		name:'taskConfig',
		data(){
			return{
				searchForm:{},
        selectList:[],//search下拉框options
        itemButtons:[
          { icon: 'icon-edit-list', action: 'edit', title:'修改' },
          { icon: 'icon-edit-delect', action: 'delete', title:'删除' }
        ],
				tHeader: [
          { type: 'selection', width: 56, align: 'center', fixed: 'left' },
          { type:'index', width:56, title:'序号',align: "center" },
          { title: '类型编码', key: 'qcGroupStr', width:134 },
          { title: '任务类型', key: 'qcStandNo', width:134 },
          { title: '状态', key: 'qcStandName', width:84 },
          { title: '可指派人', key: 'propertyNo',width:130 },
          { title: '允许转派否', key: 'qcStandTypeStr',width:84 },
          // { title: '被指派人', key: 'cyPallet',width:134 },
          { title: '被指派组', key: 'sourcePosition',width:134 },
          { title: '可转派人', key: 'waitGroupPosition',width:134 },
          { title: '自动释放时间', key: 'gbPallet',width:134 },
          { title: '创建人', key: 'createUserName',width:80 },
          { title: '创建时间', key: 'createTime',width:130 },
          { title: '修改人', key: 'updateUserName' ,width:80},
          { title: '修改时间', key: 'updateTime',width:130 }
        ],
        tData: [],
        tableLoading:false,
        pageData:{},
        addOrEditModal:false, //新增模态框
        modalTitle:'',
        codeDisabled:false,
        modalForm:{}, //新增or修改表单
        modal_loading:false,
        designate:false, //指派
        designateTitle:'', //指派标题
        designateForm:{},
        designateTH:[
          { type: 'selection', width: 56, align: 'center', fixed: 'left' },
          { type:'index', width:56, title:'序号',align: "center" },
          { title: '人员编号', key: 'qcGroupStr', width:84 },
          { title: '人员名称', key: 'qcStandNo', width:84 },
          { title: '岗位', key: 'qcStandName', width:84 },
          { title: '人员类型', key: 'qcStandName', width:84 },
          { title: '状态', key: 'qcStandName', width:84 }
        ],
        redeployTH:[
          { type: 'selection', width: 56, align: 'center', fixed: 'left' },
          { type:'index', width:56, title:'序号',align: "center" },
          { title: '人员编号', key: 'qcGroupStr', width:84 },
          { title: '人员名称', key: 'qcStandNo', width:84 },
          { title: '岗位', key: 'qcStandName', width:84 },
          { title: '人员类型', key: 'qcStandName', width:84 },
          { title: '状态', key: 'qcStandName', width:84 }
        ],
        designateTD:[], //指派人
        redeployTD:[],// 转派人
        designateGroupTH:[
          { type: 'selection', width: 56, align: 'center', fixed: 'left' },
          { type:'index', width:56, title:'序号',align: "center" },
          { title: '工作组编号', key: 'qcGroupStr', width:100 },
          { title: '工作组名称', key: 'qcStandNo', width:100 },
          { title: '组人数', key: 'qcStandName', width:100 },
          { title: '组长', key: 'qcStandName', width:100 }
        ],
        designateGroupTD:[],
        persons:[], //选择指派人员
        groups:[],//选择指派分组
        redeploys:[], //可转派人
        rules:{
          qcGroup:{required: true, message: "不能为空！", trigger: "change"},
          qcStandNo:[ //QC台号
            {required: true, message: "不能为空！", trigger: "change"},
            {max:20, message: "长度超过20个字符", trigger: "change"}
          ],
        }
			}
		},
    mounted(){
      this.Search(this.searchForm)
      this.selectList = []
      // 通过全局自定义方法获取search下来框Option
      /* this.$getSelectList({
        param: ['qc_stand_type','t_qc_group'],  //数组
        vm: this,  //当前组件的this
        selectList: this.selectList  //页面下拉框的对象，
      }) */
    },
    methods:{
      Search(params){
        console.log(123,params)
        this.cacheRegion = {...params} //暂存请求参数
        this.tableLoading = true
        console.log(params,196)
        /* getListQC(params).then(res => {
          this.tableLoading = false
          if (res.code == this.resCode.successCode) {
            this.tData = res.data.records
            this.designateTD = res.data.records
            this.designateGroupTD = res.data.records
            this.redeployTD = res.data.records
            this.pageData = res.data
          }else{
            this.$message({type: "error", content: res.msg||'后台异常！'})
          }
        }).catch(e =>{
          console.log(e)
          this.tableLoading = false
          this.$message({type: "error", content:"服务器异常！"})
        }) */
      },
      offModal(){
        this.addOrEditModal = false
      },
      onVisibleChange(formName){ //模态框状态发送变化时重置表单
        console.log(formName)
        // if (formName=='modalForm') {
        //   this.$refs[formName].resetFields();

        // }else{
        //   this.$refs[formName].resetFields();

        // }
        this.$refs[formName].resetFields();
        this.modal_loading = false
        // if (this.modalTitle==="新增") {this.modalForm={qcStandType:'0'}}
      },
      iptSearch(value){ //新增或修改表格的输入框查询
        console.log(value,228)
        if (value==='person') {
          this.designateTitle = "请选择指派人员"
        }else{
          this.designateTitle = "请选择转派人员"
        }

        this.designate = true
      },
      iptSearchGroup(value){ // 可指派组
        console.log(value,231)
        this.designateTitle = "请选择工作组"
        this.designate = true
      },
      Add(){
        console.log('add')
        this.addOrEditModal = true
        this.modalTitle = '新增'
        this.codeDisabled = false
      },
      Edit(index){
        this.addOrEditModal = true
        this.modalTitle = '修改'
        this.codeDisabled = true
        this.modalForm = {}
        this.modalForm = {...this.tData[index]}
      },

      Save(){
        console.log(1234,this.modalForm)

        if (this.modalTitle === '新增') {  //新增保存
          this.$refs['modalForm'].validate((valid) => {
            console.log(valid )
            if (valid) {
              this.modal_loading = true
              // addQC(this.modalForm).then(res => {
              //   this.modal_loading = false
              //   if (res.code == this.resCode.successCode) {
              //     this.$message({type: "success", content: "保存成功！"})
              //     this.addOrEditModal = false
              //     this.Search()
              //   }else{
              //     this.$message({type: "error", content: res.msg||'后台异常！'})
              //   }
              // }).catch(e => {
              //   console.log('error')
              //   this.modal_loading = false
              //   this.$message({type: "error", content: '服务器异常！'})
              // })
            }
          })
        }else{ //修改保存
          this.$refs['modalForm'].validate((valid) => {
            if (valid) {
              // updateQC(this.modalForm).then(res => {
              //   if (res.code == this.resCode.successCode) {
              //     this.$message({type: "success", content: "修改成功！"})
              //     this.addOrEditModal = false
              //     this.Search() //刷新
              //   }else{
              //     this.$message({type: "error", content: res.msg||'后台异常！'})
              //   }
              // }).catch(e =>{
              //   this.$message({type: "error", content: '服务器异常！'})
              // })
            }
          })
        }
      },
      Delete(id){
        console.log(id)
        this.$modal({
          title: '温馨提示',
          content: '您确定要删除这1条数据吗？',
          onOk: (vm) => {
            // deleteQC([id]).then(res => {
            //   if (res.code == this.resCode.successCode) {
            //     this.$message({type: "success", content: "删除成功！"})
            //     this.Search()
            //   }else{
            //     this.$message({type: "error", content: res.msg||'后台异常！'})
            //   }
            // }).catch(e =>{
            //   this.$message({type: "error", content: '服务器异常！'})
            // })

          },

        });
      },
      handleTable(data){ //表格操作
        console.log(data,198)
        if (data.action === 'deletes') {
          this.Delete(data.row.id)
        }
        if (data.action === 'edit') {
          this.Edit(data.index)
        }
      },
      handleTablePerson(data){
        console.log(data,462)
        this.persons = []
        if (data.action === 'select') {
          // if (this.designateTitle === "请选择指派人员") {
          //   data.rows.map(item => {
          //     this.persons.push(item.qcStandNo)
          //   })
          // }else if(this.designateTitle === "请选择转派人员"){
          //   data.rows.map(item => {
          //     this.redeploys.push(item.qcStandNo)
          //   })
          // }
          data.rows.map(item => {
            this.persons.push(item.qcStandNo)
          })
          // this.modalForm.person = this.person.toString()

          console.log(this.persons)
        }
      },
      handleTableRedeploy(data){
        console.log(493)
        this.redeploys = []
        if (data.action === 'select') {
          data.rows.map(item => {
            this.redeploys.push(item.qcGroupStr)
          })
          console.log(this.persons)
        }
      },
      handleTableGroup(data){
        console.log(503)

        this.groups = []

        if (data.action === 'select') {
          data.rows.map(item => {
            this.groups.push(item.qcStandName)
          })
        }
      },
      confirm(){ //确认人员或分组

        if (this.designateTitle === "请选择指派人员") {
          if (this.persons.length>0) {
            this.modalForm.person = this.persons.toString()
            this.designate = false
          }else{
            this.$message({type: "warn", content: '请选择可指派人'})
          }
        }else if(this.designateTitle === "请选择转派人员"){
          if (this.redeploys.length>0) {
            this.modalForm.redeploy = this.redeploys.toString()
            this.designate = false
          }else{
            this.$message({type: "warn", content: '请选择可转派人'})
          }
        }else{
          if (this.groups.length>0) {
            this.modalForm.groups = this.groups.toString()
            this.designate = false
          }else{
            this.$message({type: "warn", content: '请选择被指派组'})
          }
        }
          console.log(this.groups,this.persons)

      },
      sizeChange(){
        this.cacheRegion.limit = arguments[0]
        this.searchForm.limit = arguments[0] //记住条数
        this.Search(this.cacheRegion)
      },
      currentChange(){
        this.cacheRegion.page = arguments[0]
        this.Search(this.cacheRegion)
      },
    }
	}
</script>
<style scoped lang="less">
  /deep/.ivu-input-group-append{
    background-color: #fff;
  }
</style>