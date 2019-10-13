import apiUtils from '../index.js'
const BASE = '/api'
// 验证码
export function captcha() {
    return `http://localhost:5000/captcha`
  }

  // 登录
export async function reqPwdLogin(params) {
    let result = await apiUtils.post(`${BASE}/login_pwd`, params);
    return result;
  }

// export const reqPwdLogin = ({name, pwd, captcha})  => ajax(BASE + '/login_pwd', {name, pwd, captcha}, 'POST')