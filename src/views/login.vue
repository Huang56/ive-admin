<template>
  <div class="admin_login_wrapper">
    <div class="admin_login_form" @keyup.enter="myFakeLogin">
      <p>登录界面</p>
      <Form
        ref="formCustom"
        class="loginForm"
        :model="formCustom"
        :rules="ruleCustom"
        :label-width="80"
      >
        <FormItem label="Password" prop="passwd">
          <Input type="password" v-model="formCustom.passwd"></Input>
        </FormItem>
        <FormItem label="Confirm" prop="passwdCheck">
          <Input type="password" v-model="formCustom.passwdCheck"></Input>
        </FormItem>
        <FormItem label="Age" prop="age">
          <Input type="text" v-model="formCustom.age" number></Input>
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
                <img :src="captchaSrc" ref="captchaimg" v-show="captchaSrc" alt="验证码">
                <div class="loading">
                  <Icon type="ios-loading"/>
                  <span>加载中...</span>
                </div>
              </div>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formCustom')">Submit</Button>
          <Button @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
// import {
//   captcha
// } from "@/api/login/index";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error("The two input passwords do not match!"));
      } else {
        callback();
      }
    };
    const validateAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Age cannot be empty"));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("Please enter a numeric value"));
        } else {
          if (value < 18) {
            callback(new Error("Must be over 18 years of age"));
          } else {
            callback();
          }
        }
      }, 1000);
    };

    return {
      formCustom: {
        passwd: "",
        passwdCheck: "",
        age: "",
        captcha: ""
      },
      ruleCustom: {
        passwd: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }],
        age: [{ validator: validateAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  },
  captchaFn() {
    // console.log('captchaFn')
    this.captchaSrc = "";

    this.$nextTick(() => {
      this.captchaSrc = captcha() + "?uuid=" + this.mathRandom;
      this.$refs.captchaimg.addEventListener("error", () => {
        this.captchaSrc = "";
      });
    });
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
</style>