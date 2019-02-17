<template>
  <div class="mark-wrap" @click="closeDetail">
    <div class="mark-box">
      <div class="img-container"  @click.stop="showBigImg">
        <div class="img-box">
          <img :src="prDetail[0].U_MaxPicPath ? '/api'+prDetail[0].U_MaxPicPath : '/image/backup.jpg'">
        </div>
      </div>
      <div class="content-box">
        <div>产品单号：{{prDetail[0].DocEntry}}</div>
        <div>产品行号：{{prDetail[0].LineId}}</div>
        <div>物料编码：{{prDetail[0].U_ItemCode}}</div>
        <div>物料名称：{{prDetail[0].U_ItemName}}</div>
        <div>产品型号：{{prDetail[0].U_CodeBars}}</div>
        <div>产品规格：{{prDetail[0].U_Spec}}</div>
        <div>产品颜色：{{prDetail[0].U_Color}}</div>
        <div>产品单位：{{prDetail[0].U_Unit}}</div>
        <div>产品材质：{{prDetail[0].U_Material}}</div>
        <div>销售价：￥{{prDetail[0].U_Price1}}</div>
        <div>促销价：￥{{prDetail[0].U_Price2}}</div>
        <div>备注：{{prDetail[0].U_Remark}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PubSub from "pubsub-js";
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["prDetail"])
  },
  mounted() {
      this.$nextTick(function() {
        this.prDetail.forEach((item, index) => {
          item.src = item.U_MaxPicPath ? "/api" + item.U_MaxPicPath : "/image/backup.jpg";
          let img = document.getElementsByTagName('img')[index];
          item.w = img.width,
          item.h = img.height,
          item.target = img;
        });
      })
  },
  methods: {
    closeDetail() {
      PubSub.publish("closeDetail", {});
    },
    showBigImg() {
      this.$photoPreview.open(0, [this.prDetail[0]]);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.mark-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  .mark-box {
    position: relative;
    width: 30%;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    .img-container {
      position: relative;
      width: 50%;
      height: 0px;
      padding-top: 50%;
      margin: 10px auto;
      @media screen and (max-width: 768px) {
         width: 70%;
         padding-top: 70%;
      }
      .img-box {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .content-box {
      padding: 30px 10px 10px 20%;
      font-size: 14px;
      @media screen and (max-width: 768px) {
         font-size: 14px;
         padding:  20px 5px 5px 15%;
      }
      div {
          padding-bottom: 12px;
      }
    }
  }
}
</style>