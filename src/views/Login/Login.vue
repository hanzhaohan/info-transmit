<template>
  <div class="wrapper">
    <div class="login-box">
      <div class="cha" @click="back">×</div>
      <div class="title">登&nbsp;&nbsp;&nbsp;&nbsp;录</div>
      <div class="content">
        <el-input autofocus v-model="account" placeholder="请输入账号"></el-input>
        <el-input type="password" v-model="password" placeholder="请输入密码"></el-input>
        <el-button size="medium" type="info" style="width:300px;text-align:center;" @click="loginCon">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() { 
      return {
        account: '', //账号
        password: '',  //密码
        step: -1, //取消登录后回退几步
      }
    },
    computed: {
      ...mapState(["loginInfos"])
    },
    mounted() {
      let lim = this.$route.query.tag;
      if(lim) {
        this.step = -2;
      }
    },
    methods: {
      loginCon () {
        let formdata = new FormData();
        formdata.append("action", "Login");
        formdata.append("UserCode", this.account);
        formdata.append("PassWord", this.password);
        this.$store.dispatch('loginConfirm',formdata).then(info => {
          if(info.id === 1){
            this.$router.go(-1);
          } else {
            this.$toast(info.content, 'error');
          }}
        ).catch(error => this.$toast(error, 'error'))
      },
      back () {
        this.$router.go(this.step);
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-box {
      position: relative;
      width: 400px;
      height: 300px;
      background-color: rgba(250, 250, 250, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      .cha {
        position: absolute;
        top: 12px;
        right: 20px;
        width: 25px;
        height: 25px;
        text-align: center;
        line-height: 25px;
        border-radius: 50%;
        font-size: 22px;
        cursor: pointer;
        &:hover {
          background-color: #fff;
        }
      }
      .title {
        margin-bottom: 30px;
        margin-top: 30px;
        font-size: 20px;
      }
      .content {
        width: 300px;
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
      }
    }
  }
</style>