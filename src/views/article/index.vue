<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
        <el-form-item label="文章状态:">
          <el-radio v-model="searchForm.status" label>全部</el-radio>
          <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
          <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
          <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
          <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
        </el-form-item>
        <el-form-item label="频道列表:">
          <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
            <el-option label="html5" value="101"></el-option>
            <el-option label="css3" value="102"></el-option>
            <el-option label="JS高级" value="103"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择:"></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
      searchForm: {
        channel_id: '',
        status: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
