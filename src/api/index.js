import Vue from "vue";
import axios from "axios";
import vueAxios from "vue-axios";

Vue.use(vueAxios, axios);

// 请求DNS模块化
let domain = {
 
};

// 响应数据预处理
let inspectToken = res => {
  if (res && res.status >= 200 && res.status < 400) {
    if (res.config && res.config.responseType === "arraybuffer") {
      //导出表格的直接返回所有数据，不过滤
      download(res);
      return res;
    }
    return res && res.data;
  }
  return Promise.reject({
    data: {
      err: true,
      message: res ? res.statusText : "请求超时！",
      data: res ? res.data : ""
    }
  });
};

// 暴露请求封装
export default {
    domain,
    get(url, params, headers, str) {
      let commonParam = {};
      let loadingTarget = null;
      if (params && params.loadingTarget) {
        loadingTarget = params.loadingTarget;
        delete params.loadingTarget;
      }
      let queryConfig = {
        method: "get",
        url: `${url}`,
        strFlag: str,
        params: Object.assign({}, commonParam, params || {})
      };
      if (loadingTarget) {
        queryConfig.loadingTarget = loadingTarget;
      }
      if (headers) {
        queryConfig["headers"] = { ...headers };
      }
      return axios(queryConfig).then(inspectToken);
    },
    post(url, params, headers) {
      let loadingTarget = null;
      if (params && params.loadingTarget) {
        loadingTarget = params.loadingTarget;
        delete params.loadingTarget;
      }
      let queryConfig = {
        method: "post",
        url: `${url}`
      };
      if (loadingTarget) {
        queryConfig.loadingTarget = loadingTarget;
      }
      if (params) {
        // queryConfig["data"] = JSON.stringify(params);
        queryConfig["data"] = {data: JSON.stringify(params)};
      }
      if (headers) {
        if (headers.timeout) {
          queryConfig.timeout = headers.timeout;
          delete headers.timeout;
        }
        queryConfig["headers"] = { ...headers };
      }
      return axios(queryConfig).then(inspectToken);
    },
  };
  