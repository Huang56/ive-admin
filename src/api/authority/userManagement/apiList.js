import apiUtils from '../../index.js'
let domain = apiUtils.domain.pms

export async function getMenuAuth(params) {
    const url = `${domain}/api/permission/userinfo/listCurrentUserPermission`
    let result = await apiUtils.post(url,params)
    return result
  }
  