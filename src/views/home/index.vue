<template>
    <!-- element布局容器 -->
    <el-container>
      <!-- 左侧栏 -->
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <!-- 头部栏 -->
        <el-header>Header</el-header>
        <!-- 内容栏 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
.el-container{//布局容器样式
  height: 100%;
  .el-aside{//左侧栏样式
    background-color: rgb(50,55,69);//颜色
  }
  .el-header{//头部栏样式
    background-color: orange;//颜色
  }
  .el-main{//内容栏样式
    background-color: lightgray;//颜色
  }
}
</style>
