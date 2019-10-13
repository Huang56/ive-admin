<template>
  <div class="admin_login_wrapper">
    <div class="admin_login_form" @keyup.enter="myFakeLogin">
      <p>登录界面</p>
      <Form ref="formCustom" class="loginForm" :model="formCustom" :label-width="80">
        <FormItem label="UserName" prop="username">
          <Input type="text" v-model="formCustom.username"></Input>
        </FormItem>
        <FormItem label="Password" prop="passwd">
          <Input type="password" v-model="formCustom.passwd"></Input>
        </FormItem>
        <FormItem label="Confirm" prop="passwdCheck">
          <Input type="password" v-model="formCustom.passwdCheck"></Input>
        </FormItem>
        <FormItem prop="captcha">
          <Row :gutter="16">
            <Col :span="16">
              <Input
                size="large"
                prefix="ios-keypad-outline"
                :maxlength="4"
                type="text"
                placeholder="验证码"
                v-model.trim.lazy="formCustom.captcha"
              ></Input>
            </Col>
            <Col :span="8">
              <div class="captchaimg" @click="captchaFn">
                <!-- <img :src="captchaSrc" ref="captchaimg" v-show="captchaSrc" alt="验证码"> -->
                <img src="./images/captcha.svg" ref="captchaimg" v-show="captchaSrc" alt="验证码">
                <div class="loading" v-show="!captchaSrc">
                  <Icon type="ios-loading"/>
                  <span>加载中...</span>
                </div>
              </div>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="login">Submit</Button>
          <Button @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import { captcha, reqPwdLogin } from "@/api/login/index";
export default {
  data() {
    return {
      captchaSrc: "true", //验证码地址
      formCustom: {
        username: "",
        passwd: "",
        passwdCheck: "",
        captcha: ""
      }
    };
  },
  methods: {
    handleReset(name) {
      this.$refs[name].resetFields();
      this.captchaFn();
    },

    captchaFn() {
      // console.log('captchaFn')
      this.captchaSrc = "";

      // window.location = 'http://localhost:5000/captcha'
      // 一旦给img指定新的src值, 浏览器就会自动发请求获取数据显示为图片  (添加时间戳参数)

      this.$nextTick(() => {
        let captchaSrc = ''
        captchaSrc = captcha() + "?time=" + Date.now();
        setTimeout(()=>{
          this.captchaSrc = captchaSrc
        }, 1000)
        this.$refs.captchaimg.addEventListener("error", () => {
          this.captchaSrc = "";
        });
      });
    },

    async login() {
      // 收集表单数据
      console.log('login');
      const { username, passwd, captcha } = this.formCustom;
      let result;

      //密码
      if (!username.trim()) {
        return alert("必须指定用户名");
      } else if (!passwd.trim()) {
        return alert("必须指定密码");
      } else if (!/^.{4}$/.test(captcha)) {
        return alert("必须指定4位验证码");
      }

      // 发送登录的ajax请求
      // result = await reqPwdLogin({ username, passwd, captcha });
       // 2.跳转到个人中心
       this.$router.replace("/home");
      return console.log("/home")
      // 如果失败了,更新图形验证码
      if (result.code === 1) {
        this.updataCaptcha;
      }

      // 根据result来处理
      if (result.code === 0) {
         this.$Message.success("Success!");
        // 2.跳转到个人中心
        this.$router.replace("/home");
      } else {
        // 登录失败
        this.$Message.error("Fail!");
      }
    }
  },

  mounted() {
    this.captchaFn();
  }
};
</script>
<style lang='less' scoped>
.admin_login_wrapper {
  position: relative;
  height: 100%;
}
.admin_login_form {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: auto;
  p {
    text-align: center;
    font-size: 36px;
    padding: 8px;
    color: #fff;
  }
  .loginForm {
    padding: 50px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    overflow: hidden;
    /deep/.ivu-form-item-label {
      font-size: 16px;
      color: #fff;
    }
    /deep/.ivu-input-small {
      height: 30px;
    }
    /deep/.ivu-btn-small {
      font-size: 16px;
    }
  }
}
.captchaimg {
  height: 45px;
  img {
    width: 100px;
  }
}
</style>