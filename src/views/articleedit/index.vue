<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>修改文章</span>
    </div>
    <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
      <el-form-item label="标题:" prop="title">
        <el-input v-model="editForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容:" prop="content">
        <quill-editor v-model="editForm.content"></quill-editor>
      </el-form-item>
      <el-form-item label="封面:">
        <el-radio-group v-model="editForm.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道:" prop="channel_id">
        <Channel :chid='editForm.channel_id' @slt='selectHandler'></Channel>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editarticle(false)">发布</el-button>
        <el-button @click="editarticle(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import Channel from '@/components/channel.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 通过es6按需导入方式 导入需要的组件模块
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'ArticleEdit',
  components: {
    // 富文本编辑器的组件模块做注册
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor><quill-editor>
    quillEditor,
    Channel

  },
  // 数据声明定义
  data () {
    return {
      // 添加文章表单数据对象
      editForm: {
        title: '', // 文章标题
        tontent: '', // 文章内容
        // 文章封面
        cover: {
          type: 0, // 封面类型  -1:自动   0-无图  1-1张  3-3张
          images: [] // 封面图片 路径名集合
        },
        channel_id: '' // 频道
      },
      // 表单校验规则
      editFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      }
    }
  },
  // 请求之前处理
  created () {
    // 获得指定文章
    this.getArticleById()
  },
  computed: {
    aid () {
      // 通过计算属性简化路由参数的获取
      return this.$route.params.aid
    }
  },
  // 事件注册处理
  methods: {
    selectHandler (id) {
      this.editForm.channel_id = id
    },
    // 获得被修改文章的信息
    getArticleById () {
      let pro = this.$http({
        url: '/mp/v1_0/articles/' + this.aid,
        method: 'get'
      })
      pro
        .then(result => {
          // 表单对象接收修改文章信息
          this.editForm = result.data.data
        })
        .catch(err => {
          return this.$message.error('发布文章失败' + err)
        })
    },
    // 修改文章
    editarticle (flag) {
      // 表单整体校验
      this.$refs.editFormRef.validate(valid => {
        // 校验失败停止后续执行
        if (!valid) { return false }
        // 继续axios
        let pro = this.$http({
          url: '/mp/v1_0/articles/' + this.aid,
          method: 'put',
          data: this.editForm,
          params: { draft: flag }// 检验字符串
        })
        pro
          .then(result => {
            // 成功提示信息
            this.$message.success('发布文章成功!')
            // data接收频道数据成功就跳转
            this.$router.push({ name: 'article' })
          })
          .catch(err => {
            return this.$message.error('发布文章失败' + err)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
// .ql-editor{height: 200px;}//编译变为.ql-editor[data-v-494db270]失效的
/*使用深度作用选择器
  /deep/深度作用选择器作用:前边的会关联data-V-XX属性,而后边的不会关联
*/
.quill-editor/deep/ .ql-editor {
  height: 200px;
}
</style>
