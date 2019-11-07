<template>
  <div class="big-container">
    <headBox>
      <Breadcrumb slot="left">
        <BreadcrumbItem>基础信息</BreadcrumbItem>
        <BreadcrumbItem>线体管理</BreadcrumbItem>
        <BreadcrumbItem>扫描查询</BreadcrumbItem>
      </Breadcrumb>
    </headBox>
    <search-form
      ref="searchForm"
      :tHeaderList="tHeaderList"
      :searchList="searchList"
      @search="search"
      @reset="resetFn"
      @searchformCallback="searchformCallback"
    ></search-form>
    <!-- :searchFnFlag="!feature['/api/lineBodyManage/sendRecord/list']" -->
    <div class="table container">
      <!-- <wmsTable :tHeader="tHeader" :tData="tData" :loading="tableLoading" /> -->
      <p class="title">扫描记录列表</p>
      <canvasTable
        :tHeader="tableHeader"
        :tData="tData"
        :loading="tableLoading"
        @action="handleTable"
      />
      <pageing
        :current="page"
        :total="pageData.total"
        :size="pageData.size"
        :sizeArr="[10,20,50,100]"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pageing>
    </div>
  </div>
</template>
<script>
// import {
//   sendRecordList,
//   findSortportList
// } from "@/api/basicInfo/lineManagement/lineSweepRecord/request";
import moment from "moment";
import myIndexDb from "@/common/mimixs/indexDB";
import feature from "@/common/mimixs/feature";
import { MockData as mockData } from "./mockData";
export default {
  name: "lineSweepRecord",
  mixins: [myIndexDb, feature],
  data() {
    let tableHeader = [
      // { type: 'selection', width: 56, align: 'center', fixed: 'left' },
      { type: "index", width: 48, title: "序号", align: "center" },
      { title: "扫描数据", key: "msgdata", width: 90 },
      { title: "扫描器编号", key: "scanno", sortable: "custom", width: 90 },
      {
        title: "箱号/周转箱号",
        key: "barcode",
        sortable: "custom",
        width: 110
      },
      { title: "分配出口", key: "sortport", sortable: "custom", width: 90 },
      { title: "分配路向", key: "road", sortable: "custom", width: 90 },
      { title: "分配标记", key: "flag", sortable: "custom", width: 90 },
      // { title: '扫描时间', key: '???' },
      // { title: "分配时间", key: "sendtime" },
      { title: "描述", key: "description" },
      { title: "备注", key: "remark" }
    ];
    return {
      feature: null, //权限
      searchForm: {
        page: 1,
        limit: 20,
        endTime: new Date(),
        startTime: new Date(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1)
        )
      },
      cacheRegion: { limit: 20, page: 1 },
      selectList: {},
      page: 1,
      sortportList: [],
      tData: [],
      tableLoading: false,
      pageData: {}, //分页
      tableHeader: tableHeader,
      tHeaderList: [
        {
          title: "扫描记录列表",
          tHeader: tableHeader
        }
      ],
      searchList: [
        {
          label: "分配标记",
          type: "Select",
          key: "flag",
          option: {
            label: "label_name",
            value: "value",
            source: [
              { label_name: "已分配", value: "已分配" },
              { label_name: "未分配", value: "未分配" }
            ]
          }
        },

        {
          label: "扫描器编号",
          type: "Input",
          key: "scanno"
        },
        {
          label: "周转箱号/箱号",
          type: "Input",
          key: "barcode"
        },
        {
          label: "分配时间",
          type: "datetime",
          key: ["startTime", "endTime"]
        },
        {
          label: "分配出口",
          type: "Select",
          key: "sortport",
          option: {
            label: "itemName",
            value: "itemValue",
            source: {
              callbackFn: "findSortportList"
            }
          }
        }
      ]
    };
  },
  mounted() {
    // findSortportList()
    //   .then(res => {
    //     //分配出口
    //     if (res.code == this.resCode.successCode) {
    //       this.sortportList = res.data;
    //     } else {
    //       this.$message({ type: "error", content: res.msg || "后台异常！" });
    //     }
    //   })
    //   .catch(e => {
    //     this.$message({ type: "error", content: "服务器异常！" });
    //   });
    // this.IndexDbAjax = sendRecordList;
  },
  methods: {
    findSortportList() {
      return findSortportList()
        .then(res => {
          //分配出口
          if (res.code + "" === this.resCode.successCode + "") {
            return res.data.map(item => {
              return {
                itemValue: item,
                itemName: item
              };
            });
          } else {
            this.$message({ type: "error", content: res.msg || "后台异常！" });
          }
        })
        .catch(e => {
          this.$message({ type: "error", content: "服务器异常！" });
        });
    },
    search(data) {
      if (data) {
        this.searchForm = data;
      }
      this.searchForm.limit = this.cacheRegion.limit;
      this.searchForm.startTime = this.searchForm.startTime
        ? moment(this.searchForm.startTime).format("YYYY-MM-DD HH:mm:ss")
        : "";
      this.searchForm.endTime = this.searchForm.endTime
        ? moment(this.searchForm.endTime).format("YYYY-MM-DD HH:mm:ss")
        : "";
      this.cacheRegion = { ...this.searchForm }; //暂存请求参数
      this.page = 1;
      this.removeIndexDB("lineSweepRecord", () => {
        this.getDataList(this.cacheRegion);
      });
    },
    resetFn() {
      this.searchForm = {
        endTime: new Date(),
        startTime: new Date(
          new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 1)
        )
      };
    },
    // 根据参数获取列表数据
    getDataList(params) {
      this.tableLoading = true;
      params.page = this.page;
      this.getIndexDBValue("lineSweepRecord", params.page).then(data => {
        if (data) {
          this.tData = data;
          this.tableLoading = false;
          this.prereguisitesIndexDb(
            "lineSweepRecord",
            params.page + 1,
            this.pageData.pages,
            params
          );
        } else {
          sendRecordList(params)
            .then(res => {
              this.tableLoading = false;
              if (res.code + "" === this.resCode.successCode + "") {
                this.tData = res.data.records;
                this.pageData = res.data;
                this.setIndexDBValue(
                  "lineSweepRecord",
                  this.tData,
                  params.page
                );
                this.prereguisitesIndexDb(
                  "lineSweepRecord",
                  params.page + 1,
                  this.pageData.pages,
                  params
                );
              } else {
                this.tData = [];
                this.$message({
                  type: "error",
                  content: res.msg || "数据获取失败"
                });
              }
            })
            .catch(err => {
              this.tableLoading = false;
              this.$message({ type: "error", content: "服务器错误" });
            });

          let getList = new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(mockData);
            }, 2000);
          });

          getList
            .then(mockData => {
              this.tableLoading = false;
              if (res) {
                this.tData = mockData;
                this.pageData = res.data;
                // 存入indexDB
                this.setIndexDBValue(
                  "lineSweepRecord",
                  this.tData,
                  params.page
                );
                // 进行预请求
                this.prereguisitesIndexDb(
                  "lineSweepRecord",
                  params.page + 1,
                  this.pageData.pages,
                  params
                );
              } else {
                this.tData = [];
                this.$message({
                  type: "error",
                  content: res.msg || "数据获取失败"
                });
              }
            })
            .catch(err => {
              this.tableLoading = false;
              this.$message({ type: "error", content: "服务器错误" });
            });
        }
      });
    },
    sizeChange() {
      this.cacheRegion.limit = arguments[0];
      this.searchForm.limit = arguments[0]; //记住条数
      // this.search(this.cacheRegion);
      this.removeIndexDB("lineSweepRecord", () => {
        this.getDataList(this.cacheRegion);
      });
    },
    currentChange() {
      this.cacheRegion.page = arguments[0];
      this.page = arguments[0];
      // this.search(this.cacheRegion);
      this.getDataList(this.cacheRegion);
    },
    handleTable(data) {
      //表格操作
      if (data.action === "sort") {
        this.searchForm.order = data.order;
        if (data.order !== "normal") {
          this.searchForm.orderByField = data.prop;
        } else {
          this.searchForm.orderByField = "";
        }
        this.search(this.searchForm);
      }
    },
    searchformCallback({ theader }) {
      this.tableHeader = theader[0].tHeader;
      // this.itemButtons = itemButtons
    }
  }
};
</script>
<style scoped lang="less">
</style>