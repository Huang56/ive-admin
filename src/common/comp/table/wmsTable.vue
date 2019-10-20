<template>
<div class="wmsTable" ref="wmsTable">
	<Table border v-resize size="default" stripe :columns="tH" :data="tData" :highlight-row="true" :height="secondTable?'':tHeight" @on-expand='onExpand' @on-row-click="onRowClick" @on-row-dblclick="onRowDblclick" @on-sort-change="onSortChange"
		@on-selection-change="onSelectionChange">
	</Table>
	<!-- :loading="loading" -->
	<div class="loading" style="background-color: hsla(0,0%,100%,.9);" v-show="loading">
		<div class="loading-spinner">
			<img src="@/assets/img/logoMovie2.gif" alt="" />
			<!-- <p class="loading-text">拼命加载中</p> -->
		</div>
	</div>
</div>
<!-- v-resize
    v-draggable="tH" -->
</template>
<script>
export default {
	name: "wmsTable",
	data() {
		return {
			tH: [],
			button: this.itemButtons,
			tHeight: this.height, //表格高
			noData: "",
			errorFlagObj: {}, //表格校验数组
			messageObj: {}, //提示信息集合
			actionFlag: false //判断是点击操作按钮，还是点击整行
		};
	},
	props: {
		tHeader: {
			//表头
			type: Array,
			default: () => []
		},
		isPage: {
			type: Boolean,
			default: false
		},
		tData: {
			//表格数据
			type: Array,
			default: () => []
		},
		loading: {
			type: Boolean,
			default: false
		},
		height: {
			type: [ String, Number ]
		},
		secondTable: {
			type: Boolean,
			default: false
		},
		itemButtons: Array
	},
	created() {
		this.tH = this.tHeader;
		this.tH.map( item => {
			// item.ellipsis = true;  //气泡
			// item.tooltip = true;
			if (
				item.type === "selection" ||
				item.type === "index" ||
				item.key === "action" ||
				item.type === "expand" ||
				item.title === "操作"
			) {
				// item.fixed= "left"
				item.align = "left";
			}
			// if ( item.type !== "expand" ) {
			// 	item.render = ( h, params ) => {
			// 		return h( 'div', [
      //                       h( 'span', {
			// 				style: {
			// 					display: 'inline-block',
			// 					width: '100%',
			// 					overflow: 'hidden',
			// 					textOverflow: 'ellipsis',
			// 					whiteSpace: 'nowrap'
			// 				},
			// 				domProps: {
			// 					title: params.row[ item.key ]
			// 				}
			// 			}, params.row[ item.key ] )
      //                   ] )
			// 	}
			// }
			if (
				item.type !== "selection" &&
				item.type !== "index" &&
				item.key !== "action" &&
				item.type !== "expand" &&
				item.title !== "操作"
			) {
				item.width = item.width ?
					parseInt( item.width ) + 12 :
					item.title.length * 14 + 12;
			}
			if ( !item.children ) {
				item.minWidth = 100;
			} else {
				item.children.map( item1 => {
					item1.minWidth = 100;
				} );
			}
		} );
		// console.log("this.tH:", this.tH);
	},
	mounted() {
		// this.getButtons();
		if ( this.isPage ) {
			this.tHeight = this.$refs.wmsTable.offsetHeight - 37;
		} else if ( !this.height ) {
			this.tHeight = this.$refs.wmsTable.offsetHeight;
		}
		if ( this.tHeight < 371 ) {
			// this.tHeight = 371
		}
		//  console.log(this.tHeight)
	},
	watch: {
		tHeader() {
			this.renderTHeader();
		},
		itemButtons: {
			handler() {
				// console.log("itemButtons");
				this.getButtons();
			},
			deep: true
		},
		button: {
			handler() {
				// console.log("button");
				this.getButtons();
			},
			deep: true
		},
		height: function () {
			this.tHeight = this.height;
		}
	},
	methods: {
		renderTHeader() {
			this.tH = this.tHeader.map( item => {
				if (
					item.type === "selection" ||
					item.type === "index" ||
					item.key === "action"
				) {
					// item.fixed = "left"
					item.align = "left";
				} else {
					// item.width = item.width
					//     ? parseInt(item.width) + 12
					//     : item.title.length * 14 + 12;
				}
				if ( !item.children ) {
					item.minWidth = 100;
				} else {
					item.children.map( item1 => {
						item1.minWidth = 100;
					} );
				}
        // if ( item.type !== "expand" ) {
  			// 	item.render = ( h, params ) => {
  			// 		return h( 'div', [
        //                       h( 'span', {
  			// 				style: {
  			// 					display: 'inline-block',
  			// 					width: '100%',
  			// 					overflow: 'hidden',
  			// 					textOverflow: 'ellipsis',
  			// 					whiteSpace: 'nowrap'
  			// 				},
  			// 				domProps: {
  			// 					title: params.row[ item.key ]
  			// 				}
  			// 			}, params.row[ item.key ] )
        //                   ] )
  			// 	}
  			// }
				if ( item.renderDom ) {
					item.render = ( h, params ) => {
						let {
							getList,
							rule,
							attr,
							$value,
							$status,
							$key
						} = item.renderDom;
						return h( item.renderDom.dom, {
							props: {
								getList,
								attr,
								modelValue: params.row[ params.column.key ],
								postion: params.index + "_" + params.column._index,
								message: this.errorFlagObj[
									params.index + "_" + params.column._index
								],
								$key,
								$status,
								$value,
								rule
							},
							on: {
								input: data => {
									if (
										this.errorFlagObj[
											params.index +
											"_" +
											params.column._index
										]
									) {
										this.validateFn(
											data,
											params.column._index,
											params.index,
											rule
										);
									}
									this.$emit( "handleAction", {
										index: params.index,
										key: params.column.key,
										data: data
									} );
								}
							}
						} );
					};
				}

				return {
					ellipsis: true,
					tooltip: true,
					...item
				};
			} );
		},
		onRowClick( row, index ) {
			//单击行
			clearTimeout( this.timer );
			if ( this.actionFlag ) {
				this.actionFlag = false;
			} else {
				this.timer = setTimeout( () => {
					this.$emit( "action", {
						action: "click",
						row,
						index
					} );
				}, 300 );
			}
		},
		onRowDblclick( row, index ) {
			//双击
			clearTimeout( this.timer );
			if ( this.actionFlag ) {
				this.actionFlag = false;
			} else {
				this.timer = setTimeout( () => {
					this.$emit( "action", {
						action: "dbClick",
						row,
						index
					} );
				}, 300 );
			}
		},
		onSortChange( column ) {
			//排序
			let tHeader = this.tH.map( item => {
				if ( item.sortable === "custom" ) {
					if ( item.key === column.key ) {
						item.renderHeader = ( h, params ) => {
							if ( column.order === "asc" ) {
								return h(
									"div", {
										class: "ivu-table-cell-div",
										on: {
											click: () => {
												column.order = "desc";
												this.onSortChange( column );
											}
										}
									},
                                    [
                                        h(
											"span", {
												class: "ivu-table-cell-sort"
											},
											params.column.title
										),
                                        h( "i", {
											class: "ivu-icon-dropup"
										} )
                                    ]
								);
							} else if ( column.order === "desc" ) {
								return h(
									"div", {
										class: "ivu-table-cell-div",
										on: {
											click: () => {
												column.order = "normal";
												this.onSortChange( column );
											}
										}
									},
                                    [
                                        h(
											"span", {
												class: "ivu-table-cell-sort"
											},
											params.column.title
										),
                                        h( "i", {
											class: "ivu-icon-dropdown"
										} )
                                    ]
								);
							} else if ( column.order === "normal" ) {
								return h(
									"div", {
										class: "ivu-table-cell-div",
										on: {
											click: () => {
												column.order = "asc";
												this.onSortChange( column );
											}
										}
									},
                                    [
                                        h(
											"span", {
												class: "ivu-table-cell-sort"
											},
											params.column.title
										),
                                        h( "i", {
											class: "ivu-icon-normal"
										} )
                                    ]
								);
							}
						};
					} else {
						item.renderHeader = ( h, params ) => {
							return h(
								"div", {
									class: "ivu-table-cell-div",
									on: {
										click: () => {
											column.order = "asc";
											column.key = item.key;
											column.column.key = item.key;
											column.column.title = item.title;
											this.onSortChange( column );
										}
									}
								},
                                [
                                    h(
										"span", {
											class: "ivu-table-cell-sort"
										},
										params.column.title
									),
                                    h( "i", {
										class: "ivu-icon-normal"
									} )
                                ]
							);
						};
					}
				}
				return item;
			} );
			this.tH = tHeader;
			this.$emit( "action", {
				action: "sort",
				column: column.column,
				prop: column.key,
				order: column.order
			} );
		},
		onSelectionChange( rows ) {
			//选择时
			this.$emit( "action", {
				action: "select",
				rows
			} );
		},
		onExpand( row, status ) {
			this.$emit( "action", {
				action: "expand",
				row,
				status
			} );
		},
		getButtons() {
			if ( this.itemButtons && this.itemButtons.length ) {
				let itemButtons = {
					title: "操作",
					key: "action",
					width: this.itemButtons.length * 24 + 16,
					align: "center",
					render: ( h, params ) => {
						let {
							row,
							index,
							column
						} = params;
						let itemButtonsArray = this.itemButtons.map(
							( item, $index ) => {
								return h(
									"Icon", {
										class: `ivu-iconAction ivu-icon-${
                                            item.icon
                                        }`,
										style: {
											marginRight: $index ===
												this.itemButtons.length - 1 ?
												"" : "5px"
										},
										domProps: {
											title: item.title || ""
										},
										on: {
											click: () => {
												this.actionFlag = true;
												this.$emit( "action", {
													action: item.action,
													row,
													index,
													column
												} );
												// this.actionFlag = false
											}
										}
									},
									""
								);
							}
						);
						return h( "div", itemButtonsArray );
					}
				};
				if (
					this.tHeader.filter( item => item.type === "index" )
					.length !== 0
				) {
					this.tHeader.splice( 1, 0, itemButtons );
				} else {
					this.tHeader.unshift( itemButtons );
				}
				return this.tHeader;
			}
		},
		resetFields() {
			for ( let key of Object.keys( this.errorFlagObj ) ) {
				this.errorFlagObj[ key ] = "";
			}
		},
		validateFn( value, x, y, rule ) {
			// console.log(value, x, y, rule);
			if ( rule && rule instanceof Array ) {
				let message = "";
				for ( let item1 of rule ) {
					if ( item1.required && !value ) {
						message = item1.message;
					} else {
						message = "";
					}
					if ( item1.validator ) {
						item1.validator(
							item1,
							value,
							data => {
								if ( data ) {
									message = data.message;
								} else {
									message = "";
								}
							},
							y,
							this.tData.length
						);
					}
				}
				if ( message ) {
					this.$set( this.errorFlagObj, y + "_" + x, message );
				} else {
					this.$set( this.errorFlagObj, y + "_" + x, "" );
				}
			}
		},
		validate( callBack ) {
			this.errorFlagObj = {};
			this.tData.forEach( ( item1, $index1 ) => {
				for ( let key of Object.keys( item1 ) ) {
					this.tHeader.forEach( ( item2, $index2 ) => {
						if ( item2.renderDom && item2.key === key ) {
							this.validateFn(
								item1[ key ],
								$index2,
								$index1,
								item2.renderDom.rule
							);
						}
					} );
				}
			} );
			// console.log(22, this.errorFlagObj);
			if ( !callBack ) {
				return;
			}
			let flag = false;
			for ( let key of Object.keys( this.errorFlagObj ) ) {
				if ( this.errorFlagObj[ key ] ) {
					flag = true;
				}
			}
			if ( !flag ) {
				callBack( true );
			} else {
				callBack( false );
			}
		}
	}
};
</script>
<style scoped lang="less">
.wmsTable {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    // /deep/.mt-45{
    //    margin-top:45%;
    // }
    /deep/.ivu-table {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        color: #595959;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: auto;
        .ivu-table-row-hover td {
            background-color: #e0f6f5 !important;
        }
        .ivu-table-tip {
            flex: 1;
            position: relative;
            background: url("../../../assets/img/bg/emptyData_bg.svg") no-repeat center center;
            background-size: 170px 136px;
            // overflow: hidden;
            span {
                position: absolute;
                left: 49%;
                top: 64%;
                color: #ccc;
                display: none;
            }
            table {
                height: 100%;
            }
            td {
                background-color: transparent;
                // background: url("../../../assets/img/bg/emptyData_bg.svg")
                // no-repeat center 50%;
            }
        }
    }
    /deep/.ivu-table th {
        // height: 32px;
        height: 24px;
        background-color: #fff;
        .ivu-table-cell {
            height: 24px;
        }
    }
    /deep/.ivu-table th:hover {
        //表头
        // background-color: #F08519;
        // color:#fff;
        // border-right:1px solid #ccc;
    }
    /deep/.ivu-table td {
        height: 24px;
        // border: 0;
    }
    /deep/.ivu-table:after,
    /deep/.ivu-table:before {
        // width: 0;
    }

    .ivu-table-fixed-right,
    /deep/ .ivu-table-fixed {
        bottom: 0;
    }

    /deep/.ivu-table-column-center .ivu-table-cell {
        padding: 0;
    }
    /deep/.ivu-table-cell {
        padding: 0 6px 0 8px;
        white-space: nowrap;
        line-height: 28px;
        height: 28px;
    }
    /deep/.ivu-table-cell [class^="icon-"] {
        font-size: 24px;
        cursor: pointer;
    }

    /deep/.ivu-table-stripe .ivu-table-body tr:nth-child(2n-1) > td,
    /deep/.ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n-1) > td {
        background-color: #f5f5f5;
    }
    /deep/.ivu-table-stripe .ivu-table-body tr:nth-child(2n) > td,
    /deep/.ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) > td {
        background-color: #fff;
    }
    /deep/ .sortable-ghost {
        opacity: 0.5;
        color: #fff !important;
        background: #f08519 !important;
    }

    // /deep/.ivu-table-header {
    // min-height: 32px;
    // }

    //  /deep/ .ivu-table-body {
    //     flex: 1;
    //     overflow-y: auto;
    // }
    // /deep/ .ivu-table-fixed-body {
    //     // flex: 1;
    //     // margin-bottom: 12px;
    // }
    // /deep/ .ivu-table-fixed-right,
    // /deep/.ivu-table-fixed {
    //     height: 100%;
    //     display: flex;
    //     flex-direction: column;
    // }

    /deep/.ivu-table-column-resize-proxy {
        position: absolute;
        left: 200px;
        top: 0;
        bottom: 0;
        width: 0;
        border-left: 1px solid #f08519;
        z-index: 10;
    }
    .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td,
    .ivu-table-stripe .ivu-table-fixed-body tr.ivu-table-row-highlight:nth-child(2n) td,
    /deep/.ivu-table-row-highlight td,
    tr.ivu-table-row-highlight.ivu-table-row-hover td {
        background-color: #e0f5f6 !important;
    }

    /deep/td.ivu-table-expanded-cell {
        padding: 0;
        position: relative;
        z-index: 99;
    }
    .loading {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 999;
        text-align: center;
        line-height: 50;
        .loading-spinner {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 80px;
                height: 80px;
            }
        }
    }
    /deep/.ivu-table-cell-with-expand {
        height: 28px;
        line-height: 28px;
    }

    /deep/.ivu-table-expanded-cell .ivu-table-wrapper {
        border: 0;
        td,
        th {
            // border: 0;
            border-right: 1px solid #e8eaec;
        }

        /deep/.ivu-table:after,
        /deep/.ivu-table:before {
            width: 0;
            height: 0;
        }
    }
    /deep/.ivu-icon-dropup {
        width: 24px;
        height: 24px;
        color: #0ec1af;
        font-size: 24px;
        vertical-align: middle;
    }

    /deep/.ivu-icon-dropdown {
        width: 24px;
        height: 24px;
        color: #0ec1af;
        font-size: 24px;
        vertical-align: middle;
    }
    /deep/.ivu-icon-normal {
        width: 24px;
        height: 24px;
        color: #bfbfbf;
        font-size: 24px;
        vertical-align: middle;
    }
    /deep/.ivu-icon-normal:before {
        content: "\e986";
    }
    /deep/ .ivu-table-cell-sort {
        vertical-align: middle;
    }
    /deep/.ivu-icon-dropup:before {
        content: "\e986";
    }
    /deep/.ivu-icon-dropdown:before {
        content: "\e985";
    }

    /deep/.ivu-table-sort {
        width: 24px;
        height: 24px;
        i {
            height: 24px;
            color: #bfbfbf;
            font-size: 24px;
        }
        .ivu-icon-md-arrow-dropup:before {
            content: "\e986";
        }
        .ivu-icon-md-arrow-dropup.on:before {
            content: "\e985";
        }
        .ivu-icon-md-arrow-dropdown {
            display: none;
        }
        .ivu-icon-md-arrow-dropdown.on:before {
            content: "\e986";
        }
    }

    /deep/ .ivu-iconAction {
        display: inline-block;
        font-family: "Ionicons" !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        text-rendering: auto;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        vertical-align: middle;
        font-size: 20px;
        cursor: pointer;
    }
    /deep/ .ivu-icon-md-add-circle {
        color: #fbbc40;
    }
    /deep/ .ivu-icon-md-remove-circle {
        color: #0ec1af;
    }
    // /deep/.ivu-table-header {
    //     overflow: initial;
    // }
    // /deep/.ivu-table-tip table {
    //     width: initial;
    // }
    // /deep/.ivu-table-overflowX {
    //     overflow-x: initial;
    // }
    /deep/.ivu-table-tip table tr td {
        border: none;
    }
}
</style>
