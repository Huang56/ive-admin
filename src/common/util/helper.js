
// 全局响应式
function resizeFn(Vue) {
  //计算弹窗宽度，弹窗给百分比宽度第一次点开宽度不对
  const deviceWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  Vue.prototype.BIG_MODEL =
    deviceWidth > 1000 ? deviceWidth * 0.62 : 1024 * 0.62;
  Vue.prototype.MID_MODEL =
    deviceWidth > 1000 ? deviceWidth * 0.62 * 0.62 : 1024 * 0.62 * 0.62;
  Vue.prototype.SMALL_MODEL =
    deviceWidth > 1000 ? deviceWidth * 0.38 : 1024 * 0.38;

  // console.log(Vue.prototype.BIG_MODEL, Vue.prototype.SMALL_MODEL);
}

// 全局search下拉框数据请求
function getSelectList(option) {
  // let module = require("@/api/systemSetting/clockManagement/index");

  return new Promise((resolve, reject) => {
    option.param ? option.param : [];

    /* module
      .getLookUpDtlListArray({
        lookupCodeColl: option.param
      })
      .then(res => {
        if (~~res.code === 0) {
          option.param.forEach(item => {
            option.vm.$set(option.selectList, item, res.data[item] || []);
          });

          //传过来的码表字段和返回的字段不对应，有这个需要就需要转换一下
          if (option.replace) {
            for (let key in option.replace) {
              option.vm.$set(
                option.selectList,
                option.replace[key],
                option.selectList[key] ? option.selectList[key] : []
              );
            }
          }

          res.selectList = option.selectList;

          resolve(res);
        } else {
          this.$message({
            type: "warn",
            content: res.msg
          });
        }
      })
      .catch(e => {
        reject(e);
        this.$message({
          type: "error",
          content: messageBox.abnormalMsg
        });
      }); */
  });
};
// 安装函数
export function install(Vue) {
  resizeFn(Vue);
  window.addEventListener("resize", resizeFn(Vue), false);
  // 全局下拉框请求
  Vue.prototype.$getSelectList = getSelectList
}
