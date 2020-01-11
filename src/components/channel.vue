<template>
  <el-select v-model="nowid" placeholder="请选择" clearable>
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
// 频道下拉列表的独立组件
export default {
  name: 'Channel',
  props: {
    // 可以是props:[]形式的
    // 也可以是props:{}形式的
    // type是类型限制,还要各种类型限制的
    chid: {
      // type: Number,
      default: ''
    }
  },
  watch: {
    nowid (newV) {
      this.$emit('slt', newV)
    },
    // 监听chid,并把变化后的chid赋予给nowid,使得下拉列表有默认选中的显示
    chid (newV) {
      this.nowid = newV
    }
  },
  data () {
    return {
      channelList: [], // 频道列表
      nowid: ''// 频道下拉列表双向绑定的id
    }
  },
  created () {
    // 获得频道
    this.getChannelList()
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
          // data接收频道数据
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得频道失败' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
