<template>
  <div class="header-wrap" style="position: relative;">
    <div class="header" :class="{'header-active': isShadow}">
      <div class="name-box" @click="$router.go(-1)">
        <h3 class="name"><i class="iconfont">&#xe604;</i>歐嘉璐尼</h3>
      </div>
      <!-- <div class="search-box">
        <el-input placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="queryContent"></el-input>
      </div>-->
      <div class="login-box" v-if="isPc">
        <span @click="$router.push('/content')">
          <i class="iconfont home">&#xe60b;</i>首页
        </span>
        <span v-show="$route.meta.isShowSearch" @click="search">
          <i class="iconfont menus">&#xe60f;</i>搜索
        </span>
        <span v-show="$route.meta.isShowMenus" @click="articleMenus">
          <i class="iconfont menus">&#xe60d;</i>目录
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
      <div class="mobile-right" v-if="!isPc">
        <div class="menus" v-show="$route.meta.isShowSearch" @click="search">搜索</div>
        <div class="menus" v-show="$route.meta.isShowMenus" @click="articleMenus">目录</div>
        <div class="toggle" @click="toggle">
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
      </div>
      <transition name="tabEasy">
        <div class="tab-easy" v-show="isTabEasy && $route.meta.isShowTitle">
          <span @click="tabS(0)">最新消息</span>
          <span @click="tabS(1)">帮助文档</span>
          <span @click="tabS(2)">资料下载</span>
          <span @click="tabS(3)">产品清单</span>
        </div>
      </transition>
      <transition name="tabEasy">
        <div class="menus-easy-mark" v-show="isMenusEasy && $route.meta.isShowMenus" @click="closeMenus">
          <div class="menus-easy">
            <NewInfo v-show="newOrHelp" id="nf"/>
            <HelpArticle v-show="!newOrHelp"/>
          </div>
        </div>
      </transition>
      <el-collapse v-show="!isPc&&showMobileTabs">
        <div class="mobile-tab-wrap">
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
    </div>
    <DialogExit :dialog-visible="dialogVisible"></DialogExit>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import DialogExit from "../DialogExit/DialogExit";
import PubSub from "pubsub-js";
import HelpArticle from "../../views/ContentShow/HelpArticle/HelpArticle"
import NewInfo from "../../views/ContentShow/NewInfo/NewInfo"

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
      isMenusEasy: false, //是否展示简化版目录
      newOrHelp: true, //最新消息还是帮助文档
      searchObj:{'newinfo':0,'helparticle':1,'files':2},//搜索
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
    DialogExit,
    HelpArticle,
    NewInfo
  },
  computed: {
    ...mapState(["loginInfos", "screen", "newInfo"]),
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
      if(scrollTop >= 120) {
        this.isShadow = true;
      } else {
        this.isShadow = false;
      }
      if(scrollTop >= 120 && scrollTop < this.scrollTopBe) {
        this.isTabEasy = true;
      } else {
        this.isTabEasy = false;
      }
      this.scrollTopBe = scrollTop;
    },
    tabS(index) {
      PubSub.publish('tabS', index); 
    },
    //文章目录
    articleMenus() {
      this.classify = this.$route.query.classify;
      this.isMenusEasy = true;
      if(this.classify == 'nf') {
        this.newOrHelp = true;
      } else {
        this.newOrHelp = false;
      }
    },
    closeMenus () {
      this.isMenusEasy = false;
    },
    search(){
      let pArr = this.$route.path.split('/');
      let p = pArr[pArr.length-1];
      this.$router.push({
        path:'/search',
        query:{
          q:this.searchObj[p]
        }
      })
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
  height: 40px;
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
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    .name {
      margin: 0;
      font-size: 20px;
      @media screen and (max-width: 768px) {
        font-size: 18px;
      }
    }
  }
  // .search-box {
  //   width: 500px;
  //   height: 40px;
  //   margin: auto 40px;
  // }
  .login-box {
    height: 40px;
    line-height: 40px;
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
      .menus {
        color: #6959CD;
      }
      &:hover {
        color: red;
        cursor: pointer;
      }
    }
  }
  .mobile-right {
    .menus {
      display: inline-block;
      width: 39px;
      height: 17px;
      background-color: #f9f9f9;
      padding: 5px;
      cursor: pointer;
      line-height: 1;
      margin-top: 8px;
      margin-right: 5px;
      text-align: center;
    }
    .toggle {
      display: inline-block;
      width: 24px;
      height: 17px;
      background-color: #f9f9f9;
      padding: 5px;
      cursor: pointer;
      line-height: 0;
      margin-top: 8px;
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
  }
  .tab-easy {
    position: absolute;
    top: 40px;
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
  .menus-easy-mark {
    position: fixed;
    left: 0;
    top: 45px;
    z-index: 999;
    width: 100%;
    height: 92%;
    background-color: rgba(0, 0, 0, 0.1);
    .menus-easy {
      width: 80%;
      height: 100%;
      // margin-top: 60px;
      background-color: #f4f6f8;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .el-collapse {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    z-index: 999;
    .mobile-tab-wrap {
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
  }
  
}
.header-active {
  box-shadow: 0px 3px 5px -3px #888;
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