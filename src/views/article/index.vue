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
          <el-select
          v-model="searchForm.channel_id"
          placeholder="请选择"
          clearable
          @change="getArticleList()">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
        <el-table :data="articleList" style="width:100%;">
          <el-table-column label="图标">
            <img
              :src="stData.row.cover.images[0]"
              alt="没有图标"
              slot-scope="stData
            "
              width="150"
              height="100"
            />
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope='stData'>
            <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="$router.push('/articleedit/'+stData.row.id)"
            >修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchForm.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tot"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Article',
  watch: {
    searchForm: {
      handler: function (newV, oldV) {
        this.getArticleList()
      },
      deep: true
    },
    // 被检测的成员:function(newV,oldV)
    // newV:数据变化后的样子
    // oldV:数据变化前的样子
    timetotime (newval) {
      if (newval) {
        this.searchForm.begin_pubdate = newval[0]
        this.searchForm.end_pubdate = newval[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      // 根据最新的时间范围,获得对应文章信息
      this.getArticleList()
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
        page: 1, // 当前数据记录页码
        per_page: 10, // 分页数据记录条数(10~50)
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
    // 删除文章
    del (id) {
      // 确认事情
      this.$confirm('确认要删除该文章吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // axios请求服务端闪现删除
        let pro = this.$http({
          url: '/mp/v1_0/articles/' + id,
          method: 'delete'
        })
        pro
          .then(result => {
            // 删除文章成功
            this.getArticleList()// 刷新页面
          })
          .catch(err => {
            // 删除文章失败
            return this.$message.error('获得文章失败' + err)
          })
      }).catch(() => {

      })
    },
    // 分页相关
    // 每条条数变化的回调处理
    handleSizeChange (val) {
      console.log(val)
      this.searchForm.per_page = val
    },
    // 页码变化的回调处理
    handleCurrentChange (val) {
      this.searchForm.page = val
    },
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
      let searchData = {}
      for (var i in this.searchForm) {
        // i:代表对象的成员属性名称, status、channel_id、begin_pudate等等
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          // 成员值非空
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http({
        url: '/mp/v1_0/articles',
        method: 'get',
        params: searchData
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
.box-card {
  margin-bottom: 15px;
}
.el-pagination{
  margin-top: 15px;
  text-align: center;
}
</style>
