<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>素材管理</span>
      <el-upload
        style="float: right; padding: 3px 0"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="setToken"
        name="image"
        :show-file-list="false"
        :on-success="onSuccess"
      >
        <el-button size="small" type="primary">上传图片</el-button>
      </el-upload>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item">
      <ul>
        <li class="image-box" v-for="item in imageList" :key="item">
          <img :src="item.url" alt />
          <div class="image-bot">
            <el-button type="success" icon="el-icon-star-off" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </div>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Material',
  // 制作token的串
  computed: {
    setToken () {
      let token = JSON.parse(window.sessionStorage.getItem('userinfo')).token
      return { Authorization: 'Bearer ' + token }
    }
  },
  data () {
    return {
      // 获得素材图片的条件
      querycdt: {
        collect: false, // 非收藏
        page: 1, // 几页
        per_page: 12 // 几个
      },
      imageList: [] // 图片列表
    }
  },
  created () {
    // 获取素材图片
    this.getImageList()
  },
  methods: {
    // 素材上传完毕的回调处理
    onSuccess () {
      this.$message.success('图片上传成功！')
      this.getImageList() // 刷新图片
    },
    // 获得图片列表
    getImageList () {
      let pro = this.$http({
        url: '/mp/v1_0/user/images', // 地址
        method: 'get', // 方式
        params: this.querycdt
      })
      pro
        .then(result => {
          //   console.log(result)
          // 成功展示图片
          this.imageList = result.data.data.results
        })
        .catch(err => {
          // 失败提示
          return this.$message.error('获得图片列表失败,' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
// 素材图片列表样式
.image-box {
  list-style: none;
  width: 200px;
  height: 200px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  img {
    width: 200px;
    height: 140px;
  }
  .image-bot {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
</style>
