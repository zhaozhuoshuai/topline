<template>
  <!-- 页面大盒子 -->
  <div class="login-container">
    <!-- 中间表单小盒子 -->
    <div class="login-box">
      <!-- //绘制登录form表单 -->
      <!-- 拷贝饿了么经典表单模板:model搜罗所有表单数据   :rules用于给表单制定校验规则 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <!-- logo图片 -->
          <img src="./logo_index.png" alt="">
          <!-- 放置填写手机号框的闭合标签,里面有html标签 prop会使得校验规则 与 当前项目联系 -->
        <el-form-item prop="mobile">
          <!-- 饿了么组件库的模板 v-model双向绑定mobile  placeholder输入框里面默认内容 -->
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <!-- 放置填写验证码框的闭合标签,里面有html标签 prop会使得校验规则 与 当前项目联系 -->
        <el-form-item prop="code">
          <!-- 饿了么组件库的模板 v-model双向绑定code  placeholder输入框里面默认内容 -->
          <el-input v-model="loginForm.code" placeholder="请输入校验码"></el-input>
        </el-form-item>
        <!-- 放置协议的闭合标签  设置了文本靠左    prop会与校验规则联系 -->
        <el-form-item style="text-align:left" prop='xieyi'>
          <!-- 复选框按钮 双向绑定xieyi  设置了style样式 -->
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
        </el-form-item>
        <el-form-item>
          <!-- 登录按钮设置了样式   类型    绑定了点击事件调用login -->
          <el-button
          style="width:100%;"
          type="primary"
          @click="login()"
          :loading='isLoading'
          :disabled='isLoading'
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import './gt.js'// 引入极验人机交互gt.就是文件
// import { get } from 'http'
export default {
  data () {
    // 自定义校验函数,验证协议
    var xieyiTest = function (rule, value, callback) {
    //   if (value) {
    //     callback()
    //   } else {
    //     callback(new Error('请遵守协议'))
    //   }
    // 当前校验的信息?验证成功的返回:验证失败的返回
      value ? callback() : callback(new Error('请遵守协议'))
    }
    return {
      capObj: null,
      isLoading: false,
      // 校验输入信息
      loginFormRules: {
        mobile: [
          // required只校验 null   undefined 和空字符串 ,但是不校验false/true
          // required必填项,如果不填 就无法通过校验/如果为true,就表示该字段必填
          { required: true, message: '手机号码必填' },
          // pattern正则表达式
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          // required必填项,如果不填 就无法通过校验/如果为true,就表示该字段必填
          { required: true, message: '验证码必填' }
        ],
        xieyi: [
          // 通过validator使用该自定义校验方法
          { validator: xieyiTest }
        ]
      },
      loginForm: {
        // 默认数据填入
        mobile: '13123456789', // 手机号码
        code: '246810', // 校验码
        xieyi: true // 协议
      }
    }
  },
  // 注册事件
  methods: {
    login () {
      // this.$refs.loginFormRef // 获得el-form的组件对象
      // this.$refs.loginFormRef.validate(回调函数)
      this.$refs.loginFormRef.validate(valid => {
        // 判断valid取反进入返回false
        if (!valid) { return false }
        if (this.capObj !== null) {
          return this.capObj.verify()
        }
        this.isLoading = true
        // 进行axios请求
        let pro = this.$http({
          // 地址:端口+实例对象手机号码
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          // 请求方式:get
          method: 'get'
        })
        pro// axios返回的数据判断
          .then(result => {
            console.log(result)
            // 解构赋值响应数据的data
            let { data } = result.data
            // 挂载到window上
            window.initGeetest({
              // 以下配置参数来自服务端 SDK
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: true,
              product: 'bind'// 设置校验窗口样式
            }, captchaObj => {
              // 这里可以调用验证实例 captchaObj 的实例方法
              captchaObj.onReady(() => {
                // 验证码ready之后才能调用verify方法显示验证码(可以显示窗口了)
                captchaObj.verify() // 显示验证码窗口
                this.isLoading = false
                this.capObj = captchaObj
              }).onSuccess(() => {
                // 行为校验正确的处理
                // B. 验证账号，登录系统
                this.loginAct()
              }).onError(() => {
                // 行为校验错误的处理
              })
            })
          })
          // 获取秘钥失败弹框显示
          .catch(err => {
            return this.$message.error('获取极验秘钥失败:' + err)
          })
        // this.loginAct()
      })
    },
    loginAct () {
      // 服务端真实账户校验
      var pro = this.$http({
        // 地址
        url: '/mp/v1_0/authorizations',
        // 请求方式post
        method: 'post',
        // data数据是loginform数据
        data: this.loginForm
      })
      pro// 异步成功操作
        .then(result => {
          // 客户端记录用户的信息     ('键名',转化json格式为字符串stringify)
          window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
          // 跳转到home页面
          this.$router.push('/home')
        })
        // 异步失败操作
        .catch(err => {
          // 弹框显示
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
