<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发表文章</span>
    </div>
    <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
      <el-form-item label="标题:" prop="title">
        <el-input v-model="addForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容:" prop="content">
        <quill-editor v-model="addForm.content"></quill-editor>
      </el-form-item>
      <el-form-item label="封面:">
        <el-radio-group v-model="addForm.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <ul>
          <li class="uploadbox" v-for="item in covernum" :key="item" @click="showDialog()">
            <span>点击图标选择图片</span>
            <div class="el-icon-picture-outline"></div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="频道:" prop="channel_id">
        <Channel @slt="selectHandler"></Channel>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addarticle(false)">发布</el-button>
        <el-button @click="addarticle(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <!-- 标签切换效果 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <!-- 素材图片列表展示 -->
          <ul>
            <li class="image-box" v-for="item in imageList" :key="item.id">
              <img :src="item.url" alt="没有图片" @click="clkImage" />
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-button type="primary">上传图片</el-button>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 对频道"独立组件"做导入.注册.使用
import Channel from '@/components/channel.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 通过es6按需导入方式 导入需要的组件模块
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'ArticleAdd',
  components: {
    // 富文本编辑器的组件模块做注册
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor><quill-editor>
    quillEditor,
    Channel // 频道
  },
  // 数据声明定义
  data () {
    return {
      activeName: 'first', // 默认激活标签
      imageList: [], // 素材图片列表
      // 获取素材图片的条件参数
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      dialogVisible: false, // 素材对话框是否启用
      // 添加文章表单数据对象
      addForm: {
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
      addFormRules: {
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
  computed: {
    covernum () {
      // 设计选择框显示个数
      // type>0  ========= type值
      // type<=0 ==========0 值
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  created () {
    this.getImageList() // 获得供选取的素材图片
  },
  // 事件注册处理
  methods: {
    // 素材图片被单击选中
    clkImage (evt) {
      // evt:事件对象
      // console.log(evt) // MouseEvent
      // evt.target: 目标被单击的dom的img对象
      // evt.target.parentNode // 获得父级li标签对象
      // 给li设置border边框效果

      // 全部项目的border都清除
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }

      // 当前选中项目的border给设置好
      let nowli = evt.target.parentNode
      nowli.style.border = '5px solid green'
    },
    // 获得图片列表
    getImageList () {
      let pro = this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      })
      pro
        .then(result => {
          // console.log(result)
          // imageList接收素材图片
          this.imageList = result.data.data.results
        })
        .catch(err => {
          return this.$message.error('获得图片列表失败：' + err)
        })
    },
    // 展示对话框逻辑
    showDialog () {
      this.dialogVisible = true // 打开dialog对话框
    },
    // 声明事件方法,用于接收子组件channel传递过来的频道id
    // id:频道子组件传递过来的选中的频道id
    selectHandler (id) {
      // 把id赋值给addForm.channel_id
      this.addForm.channel_id = id
    },
    // 发表文章
    addarticle (flag) {
      // 表单整体校验
      this.$refs.addFormRef.validate(valid => {
        // 校验失败停止后续执行
        if (!valid) {
          return false
        }
        // 继续axios
        let pro = this.$http({
          url: '/mp/v1_0/articles',
          method: 'post',
          data: this.addForm,
          params: { draft: flag } // 检验字符串
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
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
// .ql-editor{height: 200px;}//编译变为.ql-editor[data-v-494db270]失效的
/*使用深度作用选择器
  /deep/深度作用选择器作用:前边的会关联data-V-XX属性,而后边的不会关联
*/
.quill-editor/deep/ .ql-editor {
  height: 200px;
}
// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
</style>
