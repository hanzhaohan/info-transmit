<template>
  <div class="header-wrap" style="position: relative;">
    <div class="header" :class="{'header-active': isShadow}">
      <div class="name-box" @click="$router.go(-1)">
        <h1 class="name"><i class="iconfont">&#xe604;</i>歐嘉璐尼</h1>
      </div>
      <!-- <div class="search-box">
        <el-input placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="queryContent"></el-input>
      </div>-->
      <div class="login-box" v-if="isPc">
        <span @click="$router.push('/content')">
          <i class="iconfont home">&#xe60b;</i>首页
        </span>
        <span v-if="writePomission" @click="writeArticle">
          <i class="iconfont">&#xe60e;</i>编写文章
        </span>
        <span v-if="writePomission" @click="addImage">
          <i class="iconfont imgAdd">&#xe656;</i>上传图片
        </span>
        <span v-if="!isLogin" @click="loginClick">
          <i class="iconfont login">&#xe734;</i>登录
        </span>
        <span v-else @click="exitClick">
          <i class="iconfont exit">&#xe669;</i>退出
        </span>
      </div>
      <div class="toggle" v-if="!isPc" @click="toggle">
        <span
          class="toggle-line"
          v-for="(line, index) in toggleLineData"
          :key="index"
          :style="{
            width: line.width,
            top: line.top,
            transform: line.transform,
            opacity: line.opacity,
            transition: 'all .3s'
          }"
        ></span>
      </div>
      <transition name="tabEasy">
        <div class="tab-easy" v-show="isTabEasy">
          <span @click="tabS(0)">最新消息</span>
          <span @click="tabS(1)">帮助文档</span>
          <span @click="tabS(2)">资料下载</span>
          <span @click="tabS(3)">产品清单</span>
        </div>
      </transition>
    </div>
    <DialogExit :dialog-visible="dialogVisible"></DialogExit>
    <el-collapse>
      <div class="mobile-tab-wrap" v-show="!isPc&&showMobileTabs">
        <span @click="$router.push('/content');toggle();">
          <i class="iconfont home">&#xe60b;</i>首页
        </span>
        <a :href="domain" @click="toggle()">
          <i class="iconfont erp">&#xe657;</i>返回ERP
        </a>
        <span v-if="!isLogin" @click="loginClick">
          <i class="iconfont login">&#xe734;</i>登录
        </span>
        <span v-else @click="exitClick">
          <i class="iconfont exit">&#xe669;</i>退出
        </span>
      </div>
    </el-collapse>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import DialogExit from "../DialogExit/DialogExit";
import PubSub from "pubsub-js";

export default {
  data() {
    return {
      queryContent: "",
      dialogVisible: false, // 是否显示退出提示框
      isPc: true,
      showMobileTabs: false,
      lineStyle: {
        normalLineData: [
          {
            width: "100%",
            top: "0px",
            transform: "rotateZ(0deg)",
            opacity: "1"
          },
          {
            width: "100%",
            top: "0px",
            transform: "rotateZ(0deg)",
            opacity: "1"
          },
          {
            width: "100%",
            top: "0px",
            transform: "rotateZ(0deg)",
            opacity: "1"
          }
        ],
        closeLineData: [
          {
            width: "100%",
            top: "6px",
            transform: "rotateZ(-45deg)",
            opacity: "1"
          },
          {
            width: "100%",
            top: "0px",
            transform: "rotateZ(0deg)",
            opacity: "0"
          },
          {
            width: "100%",
            top: "-6px",
            transform: "rotateZ(45deg)",
            opacity: "1"
          }
        ]
      },
      toggleLineData: [],
      domain: '', //ERP链接
      isShadow: false, //是否显示阴影
      isTabEasy: false, //是否显示简化版tab按钮
      scrollTopBe: 0, //记录上次滚动轴的位置
    };
  },
  created() {
    this.toggleLineData = this.lineStyle.normalLineData;
    if (document.domain === 'localhost') {
      this.domain = 'http://report.ogahome.cn:6777/';
    } else {
      this.domain = 'http://'+document.domain+':6777/';
    }
    //订阅关闭对话框事件
    PubSub.subscribe("dialog", (event, e) => {
      if (e) {
        localStorage.clear();
        this.$store.dispatch("exit");
        this.dialogVisible = !e;
        this.toggle();
      } else {
        this.dialogVisible = e;
        this.toggle();
      }
    });
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, false);
  },
  components: {
    DialogExit
  },
  computed: {
    ...mapState(["loginInfos", "screen"]),
    //显示登录or退出
    isLogin() {
      return this.loginInfos.UserCode ? true : false;
    },
    //是否有编写文章权限
    writePomission() {
      return this.loginInfos.UserCode === "manager" ? true : false;
    }
  },
  watch: {
    screen(val) {
      this.isPc = true;
      if (val.width <= 768) {
        this.isPc = false;
      }
    }
  },
  methods: {
    //转到登录界面
    loginClick() {
      this.toggle();
      this.$router.push("/login");
    },
    //退出登录
    exitClick() {
      this.dialogVisible = true;
    },
    writeArticle() {
      this.$emit("articleShow", true);
    },
    addImage() {
      this.$emit("imageShow", true);
    },
    toggle() {
      this.showMobileTabs = !this.showMobileTabs;
      this.toggleLineData = this.showMobileTabs
        ? this.lineStyle.closeLineData
        : this.lineStyle.normalLineData;
    },
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if(scrollTop >= 153) {
        this.isShadow = true;
      } else {
        this.isShadow = false;
      }
      if(scrollTop >= 153 && scrollTop < this.scrollTopBe) {
        this.isTabEasy = true;
      } else {
        this.isTabEasy = false;
      }
      this.scrollTopBe = scrollTop;
    },
    tabS(index) {
      PubSub.publish('tabS', index); 
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 999;
  max-width: 1000px;
  min-width: 320px;
  margin: 0 auto;
  padding: 0 40px;
  @media screen and (max-width: 768px) {
    padding: 0 15px;
  }
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  .name-box {
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    .name {
      margin: 0;
      font-size: 24px;
      @media screen and (max-width: 768px) {
        font-size: 22px;
      }
    }
  }
  // .search-box {
  //   width: 500px;
  //   height: 40px;
  //   margin: auto 40px;
  // }
  .login-box {
    height: 60px;
    line-height: 60px;
    span {
      font-size: 14px;
      &:not(:last-child) {
        margin-right: 12px;
      }
      .iconfont {
        color: red;
        margin-right: 5px;
      }
      .imgAdd {
        color: #b3ee3a;
      }
      .login {
        color: darkmagenta;
      }
      .exit {
        color: #a0522d;
      }
      .home {
        color: #76eec6;
      }
      &:hover {
        color: red;
        cursor: pointer;
      }
    }
  }
  .toggle {
    width: 24px;
    height: 17px;
    background-color: #f9f9f9;
    padding: 5px;
    cursor: pointer;
    line-height: 0;
    margin-top: 15px;
    .toggle-line {
      position: relative;
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 2px;
      margin-top: 4px;
      background-color: #262a30;
      &:first-child {
        margin-top: 0px;
      }
    }
  }
  .tab-easy {
    position: absolute;
    top: 60px;
    left: 0px;
    z-index: 999;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: rgba(244,246,248,0.9);
    box-sizing: border-box;
    padding-left: 30px;
    @media screen and (max-width:768px) {
      padding-left: 10px;
    }
    span {
      display: inline-block;
      width: 80px;
      height: 100%;
      color: #333;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      @media screen and (max-width:768px) {
        width: 25%;
      }
    }
  }
}
.header-active {
  box-shadow: 0px 3px 5px -3px #888;
}
.mobile-tab-wrap {
  position: absolute;
  top: 60px;
  left: 0;
  z-index: 999;
  background-color: #fff;
  padding: 10px 0 10px 10px;
  width: 100%;
  transition: all 0.3s;
  // overflow: hidden
  border-top: 1px solid #eeeeee;
  span {
    display: block;
    font-size: 14px;
    padding: 15px 0 15px 10px;
    .iconfont {
      color: red;
      margin-right: 10px;
    }
    .imgAdd {
      color: #b3ee3a;
    }
    .login {
      color: darkmagenta;
    }
    .exit {
      color: #a0522d;
    }
    .home {
      color: #76eec6;
    }
  }
  a {
    font-size: 14px;
    padding: 15px 0 15px 10px;
    .erp {
      margin-right: 10px;
      color: #b3ee3a;
    }
  }
}
.tabEasy-enter-active {
  transition: all .3s ease;
}
.tabEasy-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.tabEasy-enter, .tabTaggle-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>