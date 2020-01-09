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
            <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择:">
          <el-date-picker
            v-model="timetotime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Article',
  watch: {
    // 被检测的成员:function(newV,oldV)
    // newV:数据变化后的样子
    // oldV:数据变化前的样子
    timetotime: function (newV, oldV) {
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },
  data () {
    return {
      articleList: [],
      tot: 0, // 文章总条数
      channelList: [], // 频道列表
      timetotime: '', // 时间范围临时接收成员
      // 检索表单数据对象
      searchForm: {
        begin_pubdate: '', // 开始时间
        end_pubdate: '', // 结束时间
        channel_id: '', // 频道id
        status: '' // 文章状态,

      }
    }
  },
  created () {
    // 获得频道
    this.getChannelList()
    // 获得文章
    this.getArticleList()
  },
  methods: {
    // 获取真实频道列表数据
    getChannelList () {
      let pro = this.$http({
        url: '/mp/v1_0/channels',
        method: 'get'
      })
      pro
        .then(result => {
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得频道失败' + err)
        })
    },
    // 获取真实文章信息数据
    getArticleList () {
      let pro = this.$http({
        url: '/mp/v1_0/articles',
        method: 'get'
      })
      pro
        .then(result => {
          console.log(result)
          // data接收文章数据
          this.articleList = result.data.data.results
          // 接收总条数
          this.tot = result.data.data.total_count
        })
        .catch(err => {
          return this.$message.error('获得文章失败' + err)
        })
    }
  }

}
</script>

<style lang="less" scoped>
</style>
