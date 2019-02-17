<template>
  <div class="wrapper">
    <el-dialog title="提示" class="dialogExit" :showClose="false" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible">
      <span>确定要退出吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelExit">取 消</el-button>
        <el-button type="primary" @click="exitConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //确定退出登录
    exitConfirm() {
    //   this.$emit('dialog', true)
      PubSub.publish('dialog', true);
    },
    //取消退出
    cancelExit() {
    //   this.$emit('dialog', false)
      PubSub.publish('dialog', false);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.dialogExit {
  margin: auto;
  width: 40%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}
</style>