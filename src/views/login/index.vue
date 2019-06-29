<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <div class="form-head">
        <img src="../../assets/logo_index.png" alt="黑马头条号">
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="login-form"
      >
        <el-form-item prop="mobile">
          <el-input v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- el-col 栅格布局，一共 24 列，:span 用来指定占用的大小，:offset 用来指定偏移量 -->
          <el-col :span="14">
            <el-input v-model="ruleForm.code" placeholder="请输入验证码" class="yanzhengma"></el-input>
          </el-col>
          <el-col :span="9" :offset="1">
            <!-- <el-button @click="handleSendCode">发送验证码</el-button> -->
            <el-button
            :disabled="!!codeTimer"
            @click="handleSendCode">{{codeTimer?`剩余${codeTimeSeconds}秒`:'获取验证码'}}</el-button>
          </el-col>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item prop="agree">
          <el-checkbox class="agree-checkbox" v-model="ruleForm.agree"></el-checkbox>
          <span class="agree-checkbox-span">
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
        </el-form-item>
        <!-- 登录部分 -->
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="handleLogin" style="width:100%">登录</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import '@/vender/gt' // 引入极验  JavaScript SDK 文件,通过window.initGeetest  使用

const codeTime = 5

export default {
  name: 'AppLogin',
  data () {
    return {
      ruleForm: { // 表单数据对象
        mobile: '',
        code: '',
        agree: ''
      },
      rules: { // 验证规则对象
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度必须为11位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6位', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请阅读用户协议并同意' },
          { pattern: /true/, message: '请阅读用户协议并同意' }
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: codeTime // 倒计时时间
    }
  },
  methods: {
    // 登录部分
    handleLogin () {
      // console.log(this.ruleForm)
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过,提交登录请求
        axios({
          method: 'POST',
          url: 'http://toutiao.course.itcast.cn/mp/v1_0/authorizations',
          data: this.ruleForm
        })
          .then(res => {
            // >=200 && < 400 的状态码会进入 then 成功
            console.log(res.data)
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            this.$router.push({
              name: 'home'
            })
          })
          .catch(e => {
            // >=400 的状态码会进入这里
            this.$message.error('登录失败,手机号或验证码错误,请重新输入')
          })
      })
    },

    // 发送验证码部分
    handleSendCode () {
      // 验证手机号是否有效
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().lengeth > 0) {
          return
        }
        // 验证通过,初始化显示代码
        this.showGeetest()
      })
    },
    /*
    *验证通过,初始化显示人机交互验证码
    */

    showGeetest () {
      const { mobile } = this.ruleForm
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            // new_captcha: true,
            new_captcha: data.new_captcha,

            product: 'bind'
          },
          captchaObj => {
            captchaObj
              .onReady(() => {
                // 验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify() // 弹出验证码内容框
              })
              .onSuccess(() => {
                // console.log(captchaObj.getValidate())
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()
                axios({
                  method: 'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  params: {
                    challenge,
                    validate,
                    seccode
                  }
                }).then(res => {
                  // 发送短信成功,开始倒计时
                  this.codeCountDown()
                })
              })
              .onError(function () {
                console.log('不知道')
              })
          }
        )
      })
    },

    /*
    *验证码倒计时
    */
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          window.clearInterval(this.codeTimer)
          this.codeTimeSeconds = codeTime
          this.codeTimer = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-wrap {
    width: 400px;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    .login-form {
      margin: 0px 45px 10px 45px;
    }
    .el-form-item {
      margin-left: -100px;
    }
    .agree-checkbox-span {
      margin-left: -25px;
      color: #c1c1c1;
    }
    .form-head {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      img {
        width: 180px;
      }
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
