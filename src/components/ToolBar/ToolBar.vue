<template>
  <div class="tool-box">
    <ul class="meau-list">
      <li class>
        <span class="hover-show text">编辑</span>
      </li>
      <li class="bdsharebuttonbox">
        <span class="hover-show text text3">手机看</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tool-box {
  position: fixed;
  z-index: 100;
  top: 125px;
  right: 45px;
  @media screen and (max-width: 768px) {
    display: none;
  }
  li {
    font-size: 12px;
    color: #333;
    opacity: 0.7;
    width: 40px;
    height: 40px;
    border: 0.5px solid #ccc;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    &:hover {
        color: red;
    }
  }
}
</style>