<template>
  <div class="login-container">
    <div class="login-box">
      <!-- //绘制登录form表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <img src="./logo_index.png" alt="">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入校验码"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left" prop='xieyi'>
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import './gt.js'
export default {
  data () {
    var xieyiTest = function (rule, value, callback) {
    //   if (value) {
    //     callback()
    //   } else {
    //     callback(new Error('请遵守协议'))
    //   }
      value ? callback() : callback(new Error('请遵守协议'))
    }
    return {
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          { required: true, message: '验证码必填' }
        ],
        xieyi: [
          { validator: xieyiTest }
        ]
      },
      loginForm: {
        mobile: '13123456789', // 手机号码
        code: '246810', // 校验码
        xieyi: false // 协议
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) { return false }
        let pro = this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'get'
        })
        pro
          .then(result => {
            console.log(result)
            let { data } = result.data
            window.initGeetest({
              // 以下配置参数来自服务端 SDK
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: true,
              product: 'bind'
            }, captchaObj => {
              // 这里可以调用验证实例 captchaObj 的实例方法
              captchaObj.onReady(() => {
                // 验证码ready之后才能调用verify方法显示验证码(可以显示窗口了)
                captchaObj.verify() // 显示验证码窗口
              }).onSuccess(() => {
                // 行为校验正确的处理
                // B. 验证账号，登录系统
                this.loginAct()
              }).onError(() => {
                // 行为校验错误的处理
              })
            })
          })
          .catch(err => {
            return this.$message.error('获取极验秘钥失败:' + err)
          })
        // this.loginAct()
      })
    },
    loginAct () {
      var pro = this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'post',
        data: this.loginForm
      })
      pro
        .then(result => {
          // 客户端记录用户的信息
          window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
          this.$router.push('/home')
        })
        .catch(err => {
          this.$message.error('用户名或密码错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
    background-color: gray;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('./login_bg.jpg');
    background-size: cover;
    .login-box{
        width:410px;
        height:340px;
        background-color: #fff;
        display:flex;
        justify-content: center;
        align-items: center;
        .el-form{
            width:75%;
            text-align: center;
            img{
                width: 55%;
                margin: 15px auto;
            }
        }
    }
}

</style>
