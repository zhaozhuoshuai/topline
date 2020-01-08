<template>
    <!-- 页面 -->
    <div class="login-container">
        <!-- 中间的盒子 -->
        <div class="login-box">
        <!-- 表单域    :rules="loginFormRules"加个表单数据库,在下面定义检测-->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
            <img src="./logo_index.png" alt="">
            <!-- prop='mobile'与声明表单数据库联系 -->
            <el-form-item  prop='mobile'>
                <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <!-- prop='code'与声明表单数据库联系 -->
            <el-form-item prop='code'>
                <el-input v-model="loginForm.code"  placeholder="请输入验证码"></el-input>
            </el-form-item>
            <el-form-item prop="xieyi">
                <el-checkbox v-model="loginForm.xieyi" ></el-checkbox>
                    <span>我已阅读并同意
                        <a href="#">用户协议</a>和
                        <a href="#">隐私条款</a>
                    </span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" @click="login()">登录</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
import './gt.js'
export default {
  name: '',
  data () {
    // 自定义校验函数，验证协议
    var xieyiTest = function (rule, value, callback) {
      // 校验协议复选框的value值是否被勾选
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      // 声明定义表单域验证
      loginFormRules: {
        mobile: [// 检测手机号码填写
          { required: true, message: '手机号码必填' },
          // 正则表达式  制定规则
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [// 校验验证码
          { required: true, message: '验证码必填' }
        ],
        // 校验协议复选框
        xieyi: [
          // 校验规则要使用 validator 关联
          { validator: xieyiTest }
        ]
      },
      // 表单域数据库
      loginForm: {
        mobile: '13123456789', //
        code: '246810', //
        xieyi: true
      }
    }
  },
  // 注册事件处理
  methods: {
    // 登录系统
    login () {
      // this.$refs获取loginFormRef表单域validate回调函数返回值
      this.$refs.loginFormRef.validate(valid => {
        // 判断校验成功true还是失败false 校验失败 代码停止
        if (!valid) { return false }
        // aixos请求极验  验证信息
        var pro = this.$http({
          url: 'mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'get'
        })
        pro
          .then(result => {
            // console.log(result) // 极验的秘钥信息
            // 从result里边解构下述的data对象出来(对象结构赋值)
            let { data } = result.data
            // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
            window.initGeetest({
              // 以下配置参数来自服务端 SDK
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: true,
              product: 'bind' // 设置验证窗口样式的
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
            return this.$message.error('获取极验秘钥失败：' + err)
          })
      })
    },
    loginAct () {
      // 发axios校验账号的真实性
      let pro = this.$http({
        // 地址
        url: 'mp/v1_0/authorizations',
        // 请求方式
        method: 'post',
        // 传入data数据库的值
        data: this.loginForm
      })
      pro// 异步操作成功进入
        .then(result => {
          /// / 客户端浏览器把服务器端返回的秘钥等相关信息通过 sessionStorage 做记录，表明是登录状态
          window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
          // 路由编程式导航跳转页面
          this.$router.push('/home')
        })// 异步操作失败进入
        .catch(err => {
          //   给予弹框提示
          this.$message.error('手机号码或验证码错误:' + err)
        })
    }
  }

}
</script>

<style lang="less" scoped>
.login-container{
    height: 100%;//高百分百
    background-color: gray;//背景灰色
    display:flex;//开启flex布局
    justify-content: center;//子元素在主轴上居中对齐
    align-items: center;//侧轴单行居中对齐
    background-image: url('./login_bg.jpg');//背景图片
    background-size: cover;//完全覆盖背景区域
    .login-box{
        width: 410px;//宽
        height: 340px;//高
        background-color: #fff;//背景颜色
        display:flex;//开启flex布局
        justify-content: center;//子元素在主轴上居中对齐
        align-items: center;//侧轴单行居中对齐
        .el-form{
            width: 75%; //宽
            text-align: center;//文本居中
            img{
                width: 55%;//宽
                margin: 20px auto;//上下20margin左右auto居中
            }
        }
    }
}
</style>
