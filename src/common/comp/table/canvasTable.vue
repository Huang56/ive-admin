<template>
  <div id="xj_table" ref="xjTable" :style="{height:cHeight+'px'}">
    <vue-canvas-table :stripe="true" :selection="selection" :column="column" :isOrder="isOrder" :data="tData" :isScroll="true" :operation="operation" :buttonOptions="buttonOptions" :height="cHeight" @cell-click="cellClick" @cell-checkbox="cellCheckbox" @row-click="rowClick" @row-dblclick="rowDblClick" @current-change="currentChange" @selection-change="selectionChange" @row-edit="fixedRightClick" @scroll-to-bottom="scrollToBottom" @sort-change="sortChange" :checkedData="checkedData" />
    <div class="el-loading-mask" style="background-color: hsla(0,0%,100%,.9);" v-show="loading">
      <div class="el-loading-spinner">
        <img v-if="isQihaiFn" src="@/assets/img/logoMovie2.gif" alt="" />
        <img v-else src="@/assets/img/loading.gif" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import VueCanvasTable from "../vue-canvas-table";
import { mapState } from "vuex";
import { debounce } from "lodash";

export default {
    components: {
        VueCanvasTable
    },
    name: "canvasTable",
    data() {
        return {
            timer: null,
            cHeight: 32 * 65,
            isBottom: false,
            scrollTimer: null,
            autoHeight: "",
            column: [],
            page: {
                pageSize: 10,
                currentPage: 1
            },
            stripe: true,
            selection: true,
            options: {},
            //可选，可操作列
            operation: {
                label: "操作",
                fixed: "right",
                width: "100px",
                options: []
            },
            // 按钮配置
            buttonOptions: {},
            titleArr: {
                detail: "详情",
                edit: "修改",
                delete: "删除"
            },
            // 展示图片，对应key的值是图片的url地址
            imageOptions: {
                customerImage: true,
                companyImage: true
            },
            checkedData: [],
            currentSelectArr: []
        };
    },
    props: {
        funcList: {
            type: Array,
            default() {
                return [];
            }
        },
        radio: {
            type: Boolean,
            default: false
        },
        lazyLoad: false,
        tData: {
            type: Array,
            default() {
                return [];
            }
        },
        tHeader: {
            type: Array,
            default() {
                return [];
            }
        },
        itemButtons: {
            type: Array,
            default() {
                return [];
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        isOrder: {
            type: Boolean,
            default: false
        },

        align: {
            type: String,
            default: "left"
        },
        selectSameColObj: {
            type: Object,
            default: function() {
                return {};
            }
        },
        height: [String, Number],
        marginBottomHeight: {
            type: Number,
            default: 64
        }
    },
    watch: {
        tHeader: {
            handler() {
                this.getHeader();
            },
            deep: true
        },
        tableData: {
            handler() {
                this.getHeight();
            }
        },
        itemButtons: {
            handler() {
                this.getButtons();
            },
            deep: true
        },
        height() {
            this.getHeight();
        },
        tData: {
            deep: true,
            handler() {
                // console.log(this.tData);
                this.tData.forEach(item => {
                    for (let key of Object.keys(item)) {
                        if (item[key] === 0) {
                          item[key] = "0"
                        }
                    }
                });
            }
        }
    },
    computed: mapState({
        isQihaiFn: "isQihai"
    }),
    methods: {
        getLength(data) {
            if (typeof data !== "string") return 80;
            return data.length * 12 + 40;
        },
        getHeader() {
            let arr = [];
            this.tHeader.forEach(item => {
                if (item.sortable) {
                    // console.log(item.width + 20);
                }
                if ("key" in item) {
                    arr.push({
                        key: item.key,
                        label: item.title || "",
                        show: item.show === undefined ? true : item.show,
                        width:
                            item.width === undefined
                                ? this.getLength(item.label) + 12
                                : parseInt(item.width) + 12,
                        formatter: item.callback || null,
                        sortable: item.sortable || ""
                    });
                }

                if (item.cellClick) {
                    this.buttonOptions[item.key] = {
                        label: (item.callback && item.callback()) || "",
                        disabled: item.disabled,
                        key: item.key,
                        cellClick: true,
                        callback: item.callback
                    };
                }
            });
            this.column = arr;
            this.selection = this.tHeader.some(
                item => item.type === "selection"
            );
        },
        getButtons() {
            this.operation.options = [];
            if (this.itemButtons && this.itemButtons.length) {
                this.itemButtons.forEach(item => {
                    if (this.funcList && "code" in item) {
                        if (this.funcList.includes(item.code)) {
                            this.operation.options.push({
                                label:
                                    item.title ||
                                    this.titleArr[item.action] ||
                                    "",
                                disabled: item.disabled,
                                type: item.action
                            });
                        }
                    } else {
                        this.operation.options.push({
                            label: item.title
                                ? item.title
                                : this.titleArr[item.action] || "",
                            disabled: item.disabled,
                            type: item.action
                        });
                    }
                });

                // 单个图标最小48px，多个图标距离左右边距8px，图标之间相距6px
                if (this.operation.options.length === 1) {
                    this.operation.width = "48px";
                } else {
                    this.operation.width =
                        this.operation.options.length * 24 + 16 + "px";
                }
            }
        },
        sortChange(obj) {
            this.$emit("action", { action: "sort", ...obj });
        },
        //滚动到底部
        scrollToBottom(val) {
            if (this.lazyLoad) {
                this.$emit("action", { action: "scroll" });
            }
        },
        cellClick(row, col, value) {
            const field = {
                label: col.label,
                cellClick: true,
                key: col.key
            };
            this.$emit("action", {
                action: "cellClick",
                row: row,
                field: field
            });
        },
        rowClick(row, col, e, val, index) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$emit("action", {
                    action: "click",
                    row: row,
                    index: index
                });
            }, 300);
        },
        rowDblClick(row, col, val, index) {
            clearTimeout(this.timer);
            this.$emit("action", { action: "detail", row: row, index: index });
        },
        currentChange(row, col) {
            if (row === null) return false;
            //选择同类型
            if ("type" in this.selectSameColObj) {
                let type = row[this.selectSameColObj.type];
                let key = "";
                let arr = [];
                this.selectSameColObj.childs.forEach(child => {
                    if (child.type === type) {
                        key = child.key;
                    }
                });
                if (this.currentSelectArr.indexOf(row) === -1) {
                    this.currentSelectArr.forEach(item => {
                        if (
                            item[key] == row[key] &&
                            row[key] !== null &&
                            row[key] !== undefined
                        ) {
                        } else {
                            arr.push(this.tableData.indexOf(item));
                        }
                    });
                } else {
                    this.tableData.forEach(item => {
                        if (
                            item[key] == row[key] &&
                            item[key] !== null &&
                            item[key] !== undefined
                        ) {
                            arr.push(this.tableData.indexOf(item));
                        }
                    });
                    this.currentSelectArr.forEach(item => {
                        arr.push(this.tableData.indexOf(item));
                    });
                }
                this.checkedData = [].concat(Array.from(new Set(arr)).sort());
            }
            //单选
            if (this.radio) {
                if (this.currentSelectArr.indexOf(row) > -1) {
                    this.checkedData = [this.tableData.indexOf(row)];
                } else {
                    this.checkedData = [];
                }
            }
            // this.$emit('action', {action: 'click', row: row})
        },
        selectionChange(arr) {
            this.currentSelectArr = [].concat(arr);
            this.$emit("action", { action: "select", rows: arr });
        },
        //按钮点击
        fixedRightClick(row, btn, index) {
            //兼容画布引用图片名字不能去delete保留字，将deletes视为delete
            this.$emit("action", { action: btn.type, row: row, index: index });
        },
        cellCheckbox(rows) {},
        getHeight() {
            if (this.height) {
                this.cHeight = +this.height;
            } else {
                let Height =
                    document.documentElement.clientHeight ||
                    document.body.clientHeight;
                // 获取table距离窗口的高度
                let top = this.$el.offsetTop;
                let headerHeight = 48;
                this.cHeight =
                    Height - this.marginBottomHeight - headerHeight - top > 0
                        ? Height - this.marginBottomHeight - headerHeight - top
                        : 100;
            }
        }
    },
    created() {
        this.getHeader();
        this.getButtons();
    },
    mounted() {
        this.getHeight();
        this.data = this.tableData;
        this.resizeDebounce = debounce(this.getHeight, 100);
        window.addEventListener("resize", this.resizeDebounce);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resizeDebounce);
    }
};
</script>
<style lang="less" scoped>
#xj_table {
    position: relative;
    // height:100%;
    /*overflow: hidden;*/
    background: #fff;
    border-radius: 8px 8px 0 0;
}

#xj_table > div {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
}

#xj_table .el-loading-mask .el-loading-spinner {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

#xj_table .el-loading-mask .el-loading-spinner > img {
    width: 80px;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
