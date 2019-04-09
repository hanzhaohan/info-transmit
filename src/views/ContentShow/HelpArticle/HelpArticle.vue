<template>
  <div class="helpAr-wrap">
    <div class="classify-box">
      <el-tree v-if="isPc"
        :data="treeList"
        :props="defaultProps"
        node-key="Code"
        :default-expanded-keys="['001']"
        :default-checked-keys="['001001']"
        :highlight-current="true"
        @node-click="handleNodeClick">
      </el-tree>
      <div class="title-box">
        <ul>
          <li v-for="(item, index) in hpTitle" :key="index" @click="detailAr(item.DocEntry)">
            {{item.U_Title}}
            <div class="btn-edit" v-show="showEdit">
              <span class="edit" @click.stop="editAr(item.DocEntry)">编辑</span>
              <span class="delete" @click.stop="deleteAr(index)">删除</span>
            </div>
          </li>
        </ul>
        <no-data
        v-if="hpTitle.length === 0"
        text="此分类下暂无文档~"/>
      </div>
    </div>
    <div class='lef-btn' v-if="!isPc" @click.stop="mobileShow" :class="{'left-active': classifyFixM}">
      <i class='iconfont'>&#xe64e;</i>
    </div>
    <transition name="tabTaggle">
      <div class="mobileTab" v-show="!isPc && showMobileTabs" :class="{'mobileTab-active': classifyFixM}">
        <el-tree
        :data="treeList"
        :props="defaultProps"
        node-key="Code"
        :default-expanded-keys="['001']"
        :default-checked-keys="['001001']"
        :highlight-current="true"
        @node-click="handleNodeClick">
      </el-tree>
      </div>
    </transition>
    <HintInfo
      :dialog-visible="dialogVisible"
      :eventName="pubsubEvent"
      hint="确定要删除吗"
      btn1="取 消"
      btn2="确 定"
    />
  </div>
</template>

<script>
import { TAB_SWITCH, TAB_SWITCH_HP } from "../../../store/mutation-types";
import { mapState } from "vuex";
import HintInfo from "../../../components/HintInfo/HintInfo";
import NoData from '../../../components/NoData/NoData';
import treeify from '../../../util/treeify'
export default {
  props: {
    id: String
  },
  data() {
    return {
      tabSwitch: 0,
      hpClassify: [],
      hpTitle: [],
      dialogVisible: false, // 是否显示删除提示框
      pubsubEvent: "nfDelet", //发布订阅事件名
      index: -1, //删除标志
      isPc: true,
      showMobileTabs: false,
      classifyFixM: false, //手机端
      treeList:[],//分类的树状结构
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      code:'',//初始化的code
    };
  },
  components: {
    HintInfo,
    NoData
  },
  created() {
    //订阅关闭对话框事件
    PubSub.subscribe(this.pubsubEvent, (event, e) => {
      if (e) {
        this.dialogVisible = !e;
        let formdata = new FormData();
        formdata.append("action", "DeleteAr");
        formdata.append("docEntry", this.hpTitle[this.index].DocEntry);
        formdata.append("classify", "hw");
        this.$store
          .dispatch("deleteAr", formdata)
          .then(res => {
            if (res === 1) {
              this.hpTitle.splice(this.index, 1);
            } else {
              this.$toast("删除失败", "error");
            }
          })
          .catch(err => this.$toast(err, "error"));
      } else {
        this.dialogVisible = e;
      }
    });
  },
  mounted() {
    this.$store.commit(TAB_SWITCH, 1);
    this.tabSwitch = this.tabswhp;

    if(this.screen.width <=768){
      this.isPc = false;
    }

    let formData = new FormData();
    formData.append("action", "ReceiveHpClassify");
    formData.append("userCode", localStorage.getItem("UserCode"));
    this.$store.dispatch("receiveHpClassify", formData).then(data => {
      this.hpClassify = data;
      this.treeList = treeify(data);
      this.isChild(this.treeList[0]);
      let formData = new FormData();
      formData.append("action", "ReceiveHpTitle");
      formData.append("userCode", localStorage.getItem("UserCode"));
      formData.append("docType", this.code);
      this.$store.dispatch("receiveHpTitle", formData).then(data => {
        this.hpTitle = data;
      })
    })

    window.addEventListener('scroll', this.handleScroll, false);
  },
  computed: {
    ...mapState(['loginInfos', 'tabswhp' , 'screen']),
    showEdit() {
      return this.loginInfos.UserCode === "manager" ? true : false;
    }
  },
  watch: {
    screen(value) {
      this.isPc = true;
      if (value.width <= 768) {
        this.isPc = false;
      }
    }
  },
  methods: {
    isChild(data){
      if(data.children.length>0){
        this.isChild(data.children[0])
      }else{
        this.code = data.Code;
      }
    },
    handleNodeClick(e){
      if(e.children.length==0){
        this.showMobileTabs = false;
        let formData = new FormData();
        formData.append("action", "ReceiveHpTitle");
        formData.append("userCode", localStorage.getItem("UserCode"));
        formData.append("docType", e.Code);
        this.$store.dispatch("receiveHpTitle", formData).then(data => {
          this.hpTitle = data;
          this.$nextTick(function() {
            window.scrollTo(0, 190);
          })
        })
      }
    },
    tabswitch(index) {
      this.$store.commit(TAB_SWITCH_HP, index);
      this.showMobileTabs = false;
      this.tabSwitch = index;
      let formData = new FormData();
      formData.append("action", "ReceiveHpTitle");
      formData.append("userCode", localStorage.getItem("UserCode"));
      formData.append("docType", this.hpClassify[this.tabSwitch].Code);
      this.$store.dispatch("receiveHpTitle", formData).then(data => {
        this.hpTitle = data;
        this.$nextTick(function() {
          window.scrollTo(0, 190);
          console.log(document.documentElement.scrollHeight+' '+window.innerHeight+' '+(document.documentElement.scrollHeight-window.innerHeight))
        })
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
    },
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if(scrollTop >= 120 && this.isPc == false) {
        this.classifyFixM = true;
      } else {
        this.classifyFixM = false;
      }
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.helpAr-wrap {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  .classify-box {
    display:flex;
    justify-content:flex-start;
    padding: 10px 15px;
    transition: all 0.5s;
    .title-box {
      flex:1 1;
      ul {
        li {
          position: relative;
          float: left;
          margin-bottom: 10px;
          margin-left: 22px;  
          @media screen and (max-width: 768px) {
            margin-right: 10px;
            margin-left: 10px;  
            width: 320px
          }
          width: 310px;
          font-size: 14px;
          height: 30px;
          color: #666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;
          list-style: disc !important;
          &:hover {
            color: #333;
          }
          .btn-edit {
            position: absolute;
            right: 22px;
            bottom: 0px;
            font-size: 12px;
            color: #79a5e5;
            display: none;
            span {
              padding-right: 7px;
              cursor: pointer;
            }
          }
          &:hover {
            .btn-edit {
              display: block;
              @media screen and (max-width: 768px) {
                display: none;
              }
            }
          }
        }
      }
    }
  }
  .lef-btn {
    position: fixed;
    left: 0px;
    top: 148px;
    width: 33px;
    height: 35px;
    z-index: 100;
    background-color: transparent;
    text-align: center;
    line-height: 33px;
    box-shadow: 6px 0px 8px -5px #ccc;
    transition: all 0.5s;
    .iconfont {
      font-size: 20px !important;
      position: absolute;
      right: 5px;
      top: 2px;
      color: #007bb7;
    }
  }
  .left-active {
    top: 98px;
    left:0;
  }
  .mobileTab {
    position: fixed;
    left: 0;
    top: 181px;
    padding: 12px 10px 12px 10px;
    z-index: 100;
    background-color: #fff;
    transition: all 0.5s;
    max-height:150px;
    overflow:auto;
    .classify-item {
      height: 10px;
      font-size: 14px;
      color: #888;
      line-height: 10px;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 35px;
      }
      &:hover:not(.classify-active) {
        color: #333;
      }
    }
    .classify-active {
      color: #333;
      font-weight: bold;
    }
  }
  .mobileTab-active {
    top: 123px;
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