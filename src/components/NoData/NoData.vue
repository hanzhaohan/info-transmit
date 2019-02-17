<template>
  <div class="no-data" :style="cls">
    <img class="default-img" :src="imgUrl">
    <p v-if="text">{{text}}</p>
    <slot v-else></slot>
  </div>
</template>
<script>
// require imgUrl from '../../assets/images/nodatadefault.png';
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data () {
      return {
          imgUrl:require("../../assets/images/nodatadefault.png")
      }
  },
  computed: {
    cls () {
      return {
        fontSize: '14px'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.no-data {
  width: 100%;
  height: 100%;
  background-color: #fff;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  @media (max-width: 450px) {
      min-height: 280px;
  }
  > p {
    margin-top: 20px;
    color: #a8a8a8;
  }
.default-img {
    width: 240px;
    height: 190px;
}
}
</style>
