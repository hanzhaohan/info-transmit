<template>
  <div class="wrapper">
    <el-dialog title="提示" :showClose="false" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible" width="30%">
      <span>{{hint}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{btn1}}</el-button>
        <el-button type="primary" @click="Confirm">{{btn2}}</el-button>
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
    },
    hint: {
      type: String
    },
    btn1: {
      type: String
    },
    btn2: {
      type: String
    },
    eventName: {
      type: String
    }
  },
  methods: {
    //确定
    Confirm() {
    //   this.$emit('dialog', true)
      PubSub.publish(this.eventName, true);
    },
    //取消
    cancel() {
    //   this.$emit('dialog', false)
      PubSub.publish(this.eventName, false);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>