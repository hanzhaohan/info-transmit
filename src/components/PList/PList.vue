<template>
  <div class="product-list">
      <ul class="pl-ul">
        <li v-for="(item, index) in prClassify" :key="index" @click="tabSwitch(index)">
          <i class="iconfont" :class="{'product-active-i' : tabswitch === index}">&#xe721;</i>
          <span :class="{'product-active-span' : tabswitch === index}">{{item.U_Title}}</span>
        </li>
      </ul>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() { 
      return {
        tabswitch: 0
      }
    },
    created() {},
    mounted() {
      this.tabswitch = this.tabswpr;
    },
    computed: {
      ...mapState(['prClassify', 'tabswpr'])
    },
    methods: {
      tabSwitch(index) {
        this.tabswitch = index;
        this.$emit('tabSwitch', index);
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .product-list {
    width: 315px;
    white-space: nowrap;
    .pl-ul {
      margin: 0;
      li {
        position: relative;
        height: 30px;
        padding-bottom: 20px;
        color: #888;
        cursor: pointer;
        &:hover:not(.product-active) {
          color: #B4CDCD;
        }
        .iconfont {
          font-size: 24px;
          line-height: 30px;
          display: none;
        }
        span {
          display: inline-block;
          position: absolute;
          top: 0px;
          left: 45px;
          height: 30px;
          font-size: 16px;
          line-height: 30px;
        }
        .product-active-i {
          color: #333;
          display: block;
        }
        .product-active-span {
          color: #333;
          font-weight: 700;
        }
      }
    }
  } 
</style>