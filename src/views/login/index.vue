<template>
  <div class="login-wrap">
    <div class="login-form-warp">
      <div class="login-head">
        <img
          src="./img/logo_index.png"
          alt=""
        >
      </div>
      <div class="login-form">
        <el-form
          ref="form"
          :model="formData"
          size="small"
          :rules="rules"
        >
          <el-form-item prop="mobile">
            <el-input
              v-model="formData.mobile"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-col :span="10">
              <el-input
                v-model="formData.code"
                placeholder="请输入验证码"
              ></el-input>
            </el-col>
            <el-col
              :span="10"
              :offset="2"
            >
              <el-button
                @click="handleSendCode"
                :disabled="!!codeTimer || codeLoading"
              >{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码' }}</el-button>
            </el-col>

          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox
              v-model="formData.agree"
              name="type"
            ></el-checkbox>
            <span>我已同意<a href="#">用户协议</a></span>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btn-login"
              type="primary"
              @click="onSubmit"
              :loading='loginLoading'
            >登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "@/vendor/gt";
const initCodeTimeSeconds = 60;
export default {
  data() {
    return {
      formData: {
        mobile: "18614084953",
        code: "",
        agree: ""
      },
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { len: 11, message: "手机号为11位", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        agree: [
          {
            pattern: /true/,
            require: true,
            message: "请勾选用户协议",
            trigger: "change"
          }
        ]
      },
      captchaObj: null,
      loginLoading: false,
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: initCodeTimeSeconds, // 倒计时事件
      sendMobile: "",
      codeLoading: false //验证码按钮禁用
    };
  },
  methods: {
    onSubmit() {
      this.loginLoading = true;
      this.$refs["form"].validate(valid => {
        // console.log(valid);
        if (!valid) {
          //验证失败
          this.$message.error("请按照规则输入");
          this.loginLoading = false;
          return;
        } else {
          this.login();
        }
      });
    },
    login() {
      axios({
        method: "POST",
        url: "http://ttapi.research.itcast.cn/mp/v1_0/authorizations",
        data: this.formData
      })
        .then(res => {
          this.loginLoading = false;
          this.$message({
            message: "登陆成功",
            type: "success"
          });
          this.$router.push({
            name: "home"
          });
        })
        .catch(err => {
          this.loginLoading = false;
          //>=400的状态吗会自动进入catch中
          if (err.status === 400) {
            this.$message.error("验证码错误");
          }
        });
    },
    handleSendCode() {
      this.$refs["form"].validateField("mobile", errorMessage => {
        if (errorMessage.trim().length > 0) {
          return;
        }
        //缓存验证弹出层，没必要每次都重新请求弹窗
        if (this.captchaObj) {
          if (this.sendMobile !== this.formData.mobile) {
            this.showGeetest();
          } else {
            this.captchaObj.verify();
          }
        } else {
          this.showGeetest();
        }
      });
    },
    showGeetest() {
      // 初始化验证码期间禁用点击验证码按钮
      this.codeLoading = true;
      const { mobile } = this.formData;
      axios({
        method: "GET",
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data;
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: "bind" // 隐藏，直接弹出式
          },
          captchaObj => {
            this.captchaObj = captchaObj;
            captchaObj
              .onReady(function() {
                this.sendMobile = this.formData.mobile;
                // 验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify();
                //初始化成功后验证码按钮可点
                this.codeLoading = false;
              })
              .onSuccess(() => {
                // 人机交互验证通过
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate();
                axios({
                  method: "GET",
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  params: {
                    challenge,
                    validate,
                    seccode
                  }
                }).then(res => {
                  // 开启倒计时效果
                  this.codeCountDown();
                });
              })
              .onError(function() {
                // your code
              });
          }
        );
      });
    },
    // 验证码倒计时
    codeCountDown() {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--;
        if (this.codeTimeSeconds <= 0) {
          // 清除定时器
          window.clearInterval(this.codeTimer);
          // 让倒计时的时间回归初始状态
          this.codeTimeSeconds = initCodeTimeSeconds;
          // 将存储定时器引用的变量重新赋值为 null
          this.codeTimer = null;
        }
      }, 1000);
    }
  }
};
</script>

<style scoped lang="less">
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./img/7f.jpg") repeat;
  .login-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
    img {
      width: 100px;
    }
  }
  .login-form-warp {
    padding: 50px;
    background-color: #fff;
    border-radius: 5px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
