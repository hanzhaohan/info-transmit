<template>
  <div class="content">
    <div class="tab-box">
      <a class="newInfo tab" :class="{'tab-active' : tabswitch === 0}" @click="tabSwitch(0)">
        <i class="iconfont">&#xe622;</i>
        {{tabTitle[0].text}}
      </a>
      <a class="helpDoc tab" :class="{'tab-active' : tabswitch === 1}" @click="tabSwitch(1)">
        <i class="iconfont">&#xe7d0;</i>
        {{tabTitle[1].text}}
      </a>
      <a class="materialDown tab" :class="{'tab-active' : tabswitch === 2}" @click="tabSwitch(2)">
        <i class="iconfont">&#xe62e;</i>
        {{tabTitle[2].text}}
      </a>
      <a class="productList tab" :class="{'tab-active' : tabswitch === 3}" @click="tabSwitch(3)">
        <i class="iconfont">&#xe601;</i>
        {{tabTitle[3].text}}
      </a>
    </div>
    <div class="pane-header" :class="{'pane-block-active': paneBlock}">
      <div class="pane-header-line" :class="{'pane-line-active': paneBlock}">
        <transition name="titleToggle">
          <div class="pane-title" v-show="isTitle">{{tabWrite}}</div>
        </transition>
      </div>
    </div>
    <router-view :id="tabTitle[tabswitch].id" class="content-view" :class="{'content-padding-active': paneBlock}"></router-view>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  data() {
    return {
      tabTitle: [
        { id: "nf", text: "最新消息", path: "/content/newinfo" },
        { id: "hw", text: "帮助文档", path: "/content/helparticle" },
        { id: "ad", text: "资料下载", path: "/content/ardownload" },
        { id: "pl", text: "产品清单", path: "/content/production" }
      ],
      tabswitch: 0, //切换tab
      tabWrite: "最新消息", //内容标题
      paneBlock: false, //pane线是否固定显示
      isTitle: true, //是否显示标题
      scrollTopBe: 0, //上一秒滚动轴位置
    };
  },
  created() {
    let path = this.$route.path;
    let that = this;
    this.tabTitle.forEach(function(item, index) {
      if(item.path === path) {
        that.tabswitch = index;
        that.tabWrite = that.tabTitle[index].text;
      }
    })
    PubSub.subscribe("tabS", (event, e) => {
      this.tabSwitch(e);
    }); 
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, false);
  },
  computed: {
    ...mapState(['tabsw']),
  },
  watch: {
    tabsw(val) { 
      this.tabswitch = val;
      this.tabWrite = this.tabTitle[val].text;
    }
  },
  methods: {
    //获取tab标识
    tabSwitch(data) {
      this.tabswitch = data;
      this.tabWrite = this.tabTitle[data].text;
      this.$router.push(this.tabTitle[data].path);
    },
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      console.log(scrollTop)
      if(scrollTop >= 153) {
        this.paneBlock = true;
      } else {
        this.paneBlock = false;
      }
      if(scrollTop >= 153 && scrollTop < this.scrollTopBe) {
        this.isTitle = false;
      } else {
        this.isTitle = true;
      }
      this.scrollTopBe = scrollTop;
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.content {
  width: 100%;
  margin-top: 70px;
  position: relative;
  transition: all 0.5s;
  .tab-box {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-around;
    .tab {
      position: relative;
      padding-top: 70px;
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
      &::before {
        content: "";
        width: 50px;
        height: 50px;
        @media screen and (max-width: 768px) {
          width: 45px;
          height: 45px;
        }
        color: #41464b;
        position: absolute;
        left: 4px; //132px;
        top: 10px;
        border: 1px solid #41464b;
        border-radius: 50%;
      }
      .iconfont {
        font-size: 30px !important;
        @media screen and (max-width: 768px) {
          font-size: 28px !important;
        }
        position: absolute;
        left: 16px;//143px;
        @media screen and (max-width: 768px) {
          left: 14px;
        }
        top: 21px;
        color: #41464b;
      }
    }
    .tab-active {
      .iconfont {
        color: #fff;
      }
      &::before {
        background-color: #41464b;
      }
    }
  }
  .pane-header {
    width: 100%;
    margin-top: 55px;
    margin-bottom: 40px;
    padding-left: 15px;
    padding-right: 15px;
    box-sizing: border-box;
    transition: all 0.5s;
    .pane-header-line {
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
      line-height: 1px;
      display: flex;
      justify-content: center;
      .pane-title {
        width: 240px;
        height: 25px;
        background-color: #fff;
        text-align: center;
        font-size: 24px;
        @media screen and (max-width: 768px) {
          font-size: 20px;
          width: 140px;
        }
        font-family: "KaiTi";
        font-weight: 700;
      }
    }
    .pane-line-active {
      height: 0;
    }
  }
  .pane-block-active {
    position: fixed;
    left: 0;
    top: 4px;
    z-index: 999;
  }
  .content-padding-active {
    margin-top: 125px;
  }
}
.titleToggle-enter-active {
  transition: all .4s ease;
}
.titleToggle-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.titleToggle-enter, .tabTaggle-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>