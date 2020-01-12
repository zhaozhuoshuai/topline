<template>
  <!-- element布局容器 -->
  <el-container>
    <!-- 左侧栏 -->
    <el-aside :width="isCollapse?'65px':'200px'">
      <el-menu
        background-color="#353B4E"
        text-color="#fff"
        active-text-color="#409EFF"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/welcome" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:isCollapse?'65px':'200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/articleadd">发布文章</el-menu-item>
          <el-menu-item index="/article">内容列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="/material">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-document"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/account" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-setting"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部栏 -->
      <el-header>
        <div class="lt">
          <i
            slot="prefix"
            :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
            @click="isCollapse=!isCollapse"
          ></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <div class="rt">
          <el-input style="width:180px" placeholder="请输入搜索文章内容">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 10px;">消息</span>
          <!-- 下拉菜单 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="photo" alt width="35" height="35" />
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>git地址</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 内容栏 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入公共bus的vue对象
import bus from '@/utils/bus.js'
export default {
  name: 'Home',
  // 计算属性
  computed: {
    // 获取账号名称
    name: function () {
      return this.tmpname || JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    // 获取账号头像
    photo: function () {
      return this.tmpphoto || JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  data () {
    return {
      isCollapse: false, // true折叠  false展开
      tmpname: '', // 临时账户名称
      tmpphoto: '' // 临时账户头像
    }
  },
  created () {
    // 1. 对  名称  进行更新
    bus.$on('upAccountName', nm => {
      // 更新sessionStorage中name的信息拿出来
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      // 对userinfo对象的单个name做赋值更新
      userinfo.name = nm
      // 把更新好的userinfo再回传存储到sessionStorage
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 更新临时成员tmpname
      this.tmpname = nm
    })
    // 2. 对  名称  进行更新
    bus.$on('upAccountPhoto', ph => {
      // 更新sessionStorage中photo的信息
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.photo = ph
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 更新临时成员tmpphoto
      this.tmpphoto = ph
    })
  },
  methods: {
    // 退出系统
    logout () {
      // 确认
      this.$confirm('确实要退出系统吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          /// / 清空sessionStorage数据
          window.sessionStorage.clear()
          // 导航到登录页面
          this.$router.push({ name: 'login' })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  //布局容器样式
  height: 100%;
  .el-aside {
    //左侧栏样式
    background-color: rgb(50, 55, 69); //颜色
  }
  .el-header {
    //头部栏样式
    display: flex; //flex布局
    justify-content: space-between; //两边贴边,中间平分
    .lt {
      width: 40%; //宽40%
      height: 100%;
      font-size: 20px;
      display: flex;
      align-items: center;
      i {
        margin-right: 10px;
        font-size: 25px;
      }
    }
    .rt {
      width: 60%; //宽60%
      display: flex; //flex布局
      justify-content: flex-end; //右侧对齐
      align-items: center; //input居中
      .el-dropdown {
        span {
          display: flex; //flex布局
          align-items: center; //居中
          img {
            margin-right: 10px;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .el-main {
    //内容栏样式
    background-color: lightgray; //颜色
  }
}
</style>
