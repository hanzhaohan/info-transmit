<template>
  <div class="arDown-wrap"> 
    <!-- :style="{height:(screen.height-255)+'px'}" -->
    <ul class="classify-box" v-if="isPc">
      <li
        class="classify-item"
        :class="{'classify-active':index==tabSwitch}"
        v-for="(item, index) in dlClassify"
        :key="index"
        @click="tabswitch(index)"
      >{{item.Name}}</li>
    </ul>
    <div class='lef-btn' v-if="!isPc" @click="mobileShow">
      <i class='iconfont'>&#xe64e;</i>
    </div>
    <transition name="tabTaggle">
      <ul class="mobileTab" v-show="!isPc && showMobileTabs">
        <li
          class="classify-item"
          :class="{'classify-active':index==tabSwitch}"
          v-for="(item, index) in dlClassify"
          :key="index"
          @click="tabswitch(index)"
        >{{item.Name}}</li>
      </ul>
    </transition>
    <router-view :isPc="isPc" :showEdit="showEdit"/>
  </div>
</template>

<script>
import {TAB_SWITCH} from '../../../store/mutation-types'
import { mapState } from "vuex";
export default {
  props: {
      id: String
  },
  data() {
    return {
      tabSwitch: 0,
      dlClassify: [
        {Code: 1, Name: '全部文件'},
        {Code: 2, Name: '文档'},
        {Code: 3, Name: '图片'},
        {Code: 4, Name: '视频'},
      ],
      index: -1, //删除标志
      isPc: true,
      showMobileTabs: false
    };
  },
  components: {},
  computed: {
    ...mapState(['loginInfos', 'tabswhp' , 'screen']),
    showEdit() {
      return this.loginInfos.UserCode === "manager" ? true : false;
    }
  },
  mounted() {
    this.$store.commit(TAB_SWITCH, 2);
    //判断屏幕大小
    if(this.screen.width <=768){
      this.isPc = false;
    }
    this.$router.push({
      path: '/content/ardownload/files',
      query: {
        type: '0',
        path: '1'
      }
    })
  },
  watch: {
    screen(value) {
      this.isPc = true;
      if (value.width <= 768) {
        this.isPc = false;
      }
    },
    '$route' (to, from) {
      this.tabSwitch = to.query.type;
    }
  },
  methods: {
    tabswitch(index) {
      // this.$store.commit(TAB_SWITCH_HP, index);
      this.showMobileTabs = false;
      this.tabSwitch = index;
      this.$router.push({
        path: '/content/ardownload/files',
        query: {
          type: index,
          path: '1'
        }
      })
    },
    detailAr(docEntry) {
      this.$router.push({
        name: "detail",
        query: {
          classify: "hw",
          docEntry: docEntry
        }
      });
    },
    //编辑
    editAr(docEntry) {
      let formData = new FormData();
      formData.append("action", "ReceiveCont");
      formData.append("UserCode", localStorage.getItem("UserCode"));
      formData.append("docEntry", docEntry);
      formData.append("Id", this.id);
      this.$store.dispatch("receiveCont", formData).then(() => {
        this.$router.push({
          name: "mdedit",
          query: {
            classify: 'hw',
            id: 0
          }
        });
      })
      
    },
    //删除
    deleteAr(index) {
      this.index = index;

      this.dialogVisible = true;
    },
    mobileShow() {
      this.showMobileTabs = !this.showMobileTabs;
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.arDown-wrap {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  // height: calc(100%-79px-80px-55px-40px-1px);
  .classify-box {
    position: relative;
    width: 155px;
    height: 100%;
    padding: 10px 0;
    margin-left: 15px;
    box-sizing: border-box;
    background-color: rgba(244,246,248,0.3);
    .classify-item {
      height: 35px;
      width: 100%;
      font-size: 16px;
      color: #888;
      line-height: 35px;
      margin: auto;
      text-align: center;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 35px;
      }
      &:hover:not(.classify-active) {
        color: #333;
        background-color: rgba(244,246,248,0.8)
      }
    }
    .classify-active {
      color: #008dff;
      font-weight: 600;
    }
  }
  .lef-btn {
    position: fixed;
    right: 25px;
    top: 227px;
    width: 33px;
    height: 35px;
    z-index: 100;
    background-color: #fff;
    text-align: center;
    line-height: 33px;
    box-shadow: 6px 0px 8px -5px #ccc;
    .iconfont {
      font-size: 20px !important;
      position: absolute;
      right: 5px;
      top: 2px;
      color: #007bb7;
    }
  }
  .mobileTab {
    position: fixed;
    right: 0;
    top: 270px;
    width: 65px;
    padding: 10px 0;
    z-index: 100;
    background-color: #fff;
    margin-right: 15px;
    .classify-item {
      height: 25px;
      font-size: 14px;
      color: #888;
      line-height: 25px;
      text-align: center;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      &:hover:not(.classify-active) {
        color: #333;
      }
    }
    .classify-active {
      color: #008dff;
      font-weight: 600;
    }
  }
}
.tabTaggle-enter-active {
  transition: all .3s ease;
}
.tabTaggle-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.tabTaggle-enter, .tabTaggle-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>