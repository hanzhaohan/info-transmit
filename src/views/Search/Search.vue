<template>
  <div class="search-wrap">
    <div class="search-box">
      <el-input :placeholder="info" v-model="searchContent" class="input-with-select" @keyup.enter.native="searchAr">
        <el-button slot="append" icon="el-icon-search" @click="searchAr"></el-button>
      </el-input>
    </div>
    <div class="content" v-if="q==0 || q==1">
      <div class="newInfo-item" v-for="(item, index) in searchCon" :key="index">
        <div class="title ellipsis" @click="detailAr(index)">{{item.U_Title}}</div>
      </div>
    </div>
    <no-data
      v-if="searchCon.length === 0 && isShowNo"
      text="您查询的数据不存在呦~~"/>
  </div>
</template>

<script>
import {
  RECEIVE_SEARCH_Q,
  RECEIVE_SEARCH_CON
} from "../../store/mutation-types";
import { mapState } from "vuex";
import NoData from '../../components/NoData/NoData'
export default {
  data() {
    return {
      // searchArr:['newinfo','helparticle','files'],
      routeArr:['nf','hw'],//查看文章详情
      infoArr: ['"最新消息"', '"帮助文档"', '"资料下载"'], //placeholder提示信息
      info: "", //placeholder提示信息
      searchContent: "", //搜索关键字
      q: 0, //query参数
      searchCon: [], //搜索结果数组
      isShowNo:false,//是否提示查询数据不存在
    };
  },
  components:{
    NoData
  },
  mounted() {
    let qq = this.$route.query.q;
    this.q = qq;
    //placeholder提示信息
    this.info = "请输入" + this.infoArr[qq] + "模块的查询关键字";
    if (qq == this.sq) {
      this.searchContent = this.scon;
      this.searchCon = this.sdata;
    }
  },
  computed: {
    ...mapState(["sq", "scon", "sdata"])
  },
  methods: {
    searchAr() {
      let formData = new FormData();
      formData.append("action", "ReceiveSearch");
      formData.append("docClassify", this.q);
      formData.append("searchContent", this.searchContent);
      formData.append("UserCode", localStorage.getItem("UserCode"));
      this.$store.dispatch("receiveSearch", formData).then(data => {
        this.isShowNo = true;
        //将分类和关键字缓存到内存中
        this.$store.commit(RECEIVE_SEARCH_Q, this.q);
        this.$store.commit(RECEIVE_SEARCH_CON, this.searchContent);
        this.searchCon = data;
      });
    },
    detailAr(ids) {
        this.$router.push({
        name: "detail",
        query: {
          classify: this.routeArr[this.q],
          docEntry: this.searchCon[ids].DocEntry
        }
      });
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.search-wrap {
  margin-top: 60px;
  .search-box {
    width: 60%;
    margin-bottom: 5px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
  .content {
    padding: 10px 15px 10px;
    @media screen and (max-width: 768px) {
      padding: 10px 10px 10px;
    }
    .newInfo-item {
      position: relative;
      .title {
        height: 30px;
        line-height: 30px;
        font-weight: 600;
        font-size: 14px;
        color: #3d3d3d;
        cursor: pointer;
        margin-top: 5px;
        &:hover {
          color: red;
        }
      }
    }
  }
}
</style>