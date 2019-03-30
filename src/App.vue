<template>
  <div id="app">
    <Header class="noprint" @articleShow="articleShow" @imageShow="imageShow" v-show="$route.meta.isShow"/>
    <router-view class="content-wrap" />
  </div>
</template>

<script>
import Header from "./components/Header/Header"
import {SCREEN_CHANGE} from './store/mutation-types'

export default {
  data() {
    return {};
  },
  mounted() {
    //判断localStorage是否存有登录信息
    if (localStorage.getItem("UserCode")) {
      let loginObj = {};
      loginObj.Company = localStorage.getItem("Company");
      loginObj.DepName = localStorage.getItem("DepName"); //部门
      loginObj.UserCode = localStorage.getItem("UserCode"); //账号
      loginObj.UserName = localStorage.getItem("UserName"); //用户名
      loginObj.Dept = localStorage.getItem("Dept"); //部门编号
      this.$store.dispatch("saveLogin", loginObj);
    }
    //监视屏幕大小变化
    this._updataScreen();
    window.addEventListener('resize', this._updataScreen);
  },
  components: {
    Header
  },
  methods: {
    articleShow(e) {
      this.$router.push('/mdedit');
    },
    imageShow(e) {
      this.$router.push('/addimage');
    },
    _updataScreen() {
      this.$store.commit(SCREEN_CHANGE, {
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  border: 1px solid transparent;
  .noprint{
    @media print {
      display : none
    }
  }
  .content-wrap {
    position: relative;
    max-width: 1000px;
    min-width: 320px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 30px;
    @media screen and (max-width: 768px) {
      padding: 0 15px;
    }
    box-sizing: border-box;
  }
}
</style>
