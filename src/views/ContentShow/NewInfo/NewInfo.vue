<template>
  <div class="newInfo-box">
    <div class="newInfo-item" v-for="(item, index) in newInfo" :key="index">
      <div class="title ellipsis" @click="detailAr(index)">{{item.U_Title}}</div>
      <p class="summary ellipsis" v-text="item.U_ContentHtml.replace(/<[^>]+>/gim, '').substring(0,150)+'...'" @click="detailAr(index)"></p>
      <div class="botInfo">
        <span class="time">{{item.CreateDate}}</span>
      </div>
      <div class="btn-edit" v-show="showEdit">
        <span class="top">置顶</span>
        <span class="edit" @click="editAr(index)">编辑</span>
        <span class="delete" @click="deleteAr(index)">删除</span>
      </div>
    </div>
    <no-data
      v-if="newInfo.length === 0"
      text="暂无信息~"/>
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
import { mapState } from "vuex";
import PubSub from "pubsub-js";
import HintInfo from "../../../components/HintInfo/HintInfo";
import {TAB_SWITCH} from '../../../store/mutation-types'
import NoData from '../../../components/NoData/NoData'

export default {
  props: {
    id: String
  },
  data() {
    return {
      dialogVisible: false, // 是否显示删除提示框
      index: -1, //删除标志
      pubsubEvent: "nfDelet" //发布订阅事件名
    };
  },
  components: {
    HintInfo,
    NoData
  },
  computed: {
    ...mapState(["newInfo", "loginInfos"]),
    showEdit() {
      return this.loginInfos.UserCode === "manager" ? true : false;
    }
  },
  created() {
    //订阅关闭对话框事件
    PubSub.subscribe(this.pubsubEvent, (event, e) => {
      if (e) {
        this.dialogVisible = !e;
        let formdata = new FormData();
        formdata.append("action", "DeleteAr");
        formdata.append("docEntry", this.newInfo[this.index].DocEntry);
        formdata.append("classify", "nf");
        this.$store
          .dispatch("deleteAr", formdata)
          .then(res => {
            if (res === 1) {
              this.newInfo.splice(this.index, 1);
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
    this.$store.commit(TAB_SWITCH, 0);

    let formData = new FormData();
    formData.append("action", "ReceiveCont");
    formData.append("Id", this.id);
    formData.append("UserCode", localStorage.getItem("UserCode"));
    this.$store.dispatch("receiveCont", formData);
  },
  methods: {
    //查看详情
    detailAr(index) {
      this.$router.push({
        name: "detail",
        query: {
          classify: "nf",
          docEntry: this.newInfo[index].DocEntry
        }
      });
    },
    //编辑
    editAr(index) {
      this.$router.push({
        name: "mdedit",
        query: {
          classify: 'nf',
          id: index
        }
      });
    },
    //删除
    deleteAr(index) {
      this.index = index;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.newInfo-box {
  padding: 0px 15px 10px;
  @media screen and (max-width: 768px) {
    padding: 0px 10px 10px;
  }
  .newInfo-item {
    position: relative;
    border-bottom: 1px solid #ccc;
    .title {
      height: 30px;
      line-height: 30px;
      font-weight: 700;
      font-size: 16px;
      color: #3d3d3d;
      cursor: pointer;
      margin-top: 5px;
      &:hover {
        color: red;
      }
    }
    .summary {
      max-height: 44px;
      font-size: 14px;
      color: #999;
      line-height: 22px;
      white-space: normal;
      word-wrap: break-word;
      cursor: pointer;
      margin: 3px 0;
    }
    .botInfo {
      font-size: 14px;
      color: #6b6b6b;
      height: 30px;
      line-height: 30px;
    }
    .btn-edit {
      position: absolute;
      right: 24px;
      bottom: 9px;
      font-size: 14px;
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
</style>