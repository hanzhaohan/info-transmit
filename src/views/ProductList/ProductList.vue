<template>
  <div class="productlist-box">
    <div class="content">
      <div class="production-wrap">
        <div class="search-box">
          <el-input placeholder="请输入查询内容" v-model="searchContent" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchPr"></el-button>
          </el-input>
        </div>
        <PContentList />
      </div>
    </div>
    <no-data
      v-if="productList.length === 0"
      text="暂无数据~"/>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import PContentList from "../../components/PContentList/PContentList";
import NoData from '../../components/NoData/NoData'
export default {
  data() {
    return {
      searchContent: "",
      productList: [],
      prClassify: []
    };
  },
  components: {
    PContentList,
    NoData
  },
  computed: {},
  mounted() {
    let tabswitch = this.$route.query.id;
    this.prClassify = JSON.parse(localStorage.getItem('prClassify'));
    let formData = new FormData();
    formData.append("action", "ReceiveContPr");
    formData.append("docEntry", this.prClassify[tabswitch].DocEntry);
    formData.append("searchContent", this.searchContent);
    formData.append("UserCode", localStorage.getItem("UserCode"));
    this.$store.dispatch("receiveContPr", formData).then(data => {
      this.productList = data;
    })
  },
  methods: {
    searchPr() {
      let tabswitch = this.$route.query.id;
      let formData = new FormData();
      formData.append("action", "ReceiveContPr");
      formData.append("docEntry", this.prClassify[tabswitch].DocEntry);
      formData.append("searchContent", this.searchContent);
      formData.append("UserCode", localStorage.getItem("UserCode"));
      this.$store.dispatch("receiveContPr", formData).then(data => {
        this.productList = data;
      })
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.productlist-box {
  .content {
    width: 100%;
    .production-wrap {
      padding-top: 70px;
      .search-box {
        width: 60%;
        margin-bottom: 5px;
        @media screen and (max-width: 768px) {
          width: 100%;
        }
      }
    }
  }
}
</style>