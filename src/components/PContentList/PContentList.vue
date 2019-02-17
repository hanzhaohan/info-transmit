<template>
  <div class="p-content-box">
    <!-- <div class="p-content-item" v-for="(item, index) in productList" :key="index">
      @click="magnifyImg(item.U_MaxPicPath)"
      <div class="img-container">  
        <div class="img-box"><img :ref="index" preview="1" :src="item.U_MaxPicPath ? '/api'+item.U_MaxPicPath :'/image/backup.jpg'"></div>
      </div>
      <div class="info-container">
        <div class="info-item">
          <div>产品单号：{{item.DocEntry}}</div>
          <div>产品行号：{{item.LineId}}</div>
          <div>物料编码：{{item.U_ItemCode}}</div>
          <div>物料名称：{{item.U_ItemName}}</div>
        </div>
        <div class="info-item">
          <div>产品型号：{{item.U_CodeBars}}</div>
          <div>产品颜色：{{item.U_Color}}</div>
        </div>
        <div class="info-item">
          <div>销售价：{{item.U_Price1}}</div>
          <div>促销价：{{item.U_Price2}}</div>
        </div>
      </div>
      <div class="btn-edit" v-show="showEdit">
        <div class="delete" @click="deletePr(index)">删除</div>
        <div class="edit">
          <input type="file" accept="image/*" @change="imageHandle($event, index)" class="originInp">上传图片
        </div>
      </div>
    </div>-->
    <div class="p-content-item" v-for="(item, index) in productList" :key="index">
      <div class="img-container">
        <div class="img-box" @click="showBigImg(index)">
          <img
            :src="item.U_MaxPicPath ? '/api'+item.U_MaxPicPath :'/image/backup.jpg'"
            :ref="index"
          >
        </div>
      </div>
      <div class="info-container" @click="detailPr(index)">
        <div class="info-item">
          <div>{{item.U_ItemName}}</div>
          <div>{{item.U_CodeBars}}</div>
          <div>{{item.U_Spec}}</div>
          <div>{{item.U_Color}}</div>
          <div>销售价：￥{{item.U_Price1}}</div>
          <div>促销价：￥{{item.U_Price2}}</div>
        </div>
      </div>
      <div class="btn-edit" v-show="showEdit">
        <div class="delete" @click="deletePr(index)">删除</div>
        <div class="edit">
          <input
            type="file"
            accept="image/*"
            @change="imageHandle($event, index)"
            class="originInp"
          >上传图片
        </div>
      </div>
    </div>
    <div class="magnify-img" v-show="isMf" @click="restoreImg">
      <div class="imgbox">
        <img :src="mfImg" alt>
      </div>
    </div>
    <ProductDetail v-if="detailShow"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UploadImg from "../../util/uploadImg";
import ProductDetail from "../ProductDetail/ProductDetail";
import PubSub from "pubsub-js";
export default {
  // props: ["productList"],
  data() {
    return {
      isMf: false,
      mfImg: "",
      detailShow: false
    };
  },
  components: {
    ProductDetail
  },
  computed: {
    ...mapState(['loginInfos', 'productList']),
    showEdit() {
      return this.loginInfos.UserCode === "manager" ? true : false;
    }
  },
  watch: {
    productList(value) {
      this.$nextTick(function() {
        value.forEach((item, index) => {
          item.src = item.U_MaxPicPath ? "/api" + item.U_MaxPicPath : "/image/backup.jpg";
          let img = document.getElementsByTagName('img')[index];
          item.w = img.width,
          item.h = img.height,
          item.target = img;
        });
      })
    }
  },
  created() {
    PubSub.subscribe("closeDetail", (event, e) => {
      this.detailShow = false;
    });
  },
  mounted() {},
  methods: {
    magnifyImg(src) {
      this.isMf = true;
      this.mfImg = src ? "/api" + src : "/image/backup.jpg";
    },
    restoreImg() {
      this.isMf = false;
      this.mfImg = "";
    },
    imageHandle(e, index) {
      let maxSize = 100 * 1024;
      let imgDom = this.$refs[index];
      let files = e.srcElement.files;
      if (!files.length) return; //文件长度大于0
      if (!/^image\//.test(files[0].type)) return; //必须是图片才处理
      if (!window.FileReader) return; //支持FileReader
      UploadImg.imageHandle(files, maxSize, imgDom).then(formdata => {
        formdata.append("docEntry", this.productList[index].DocEntry);
        formdata.append("lineId", this.productList[index].LineId);
        formdata.append("action", "ProductionListImage");
        this.$store
          .dispatch("uploadImage", formdata)
          .then(data => {
            if (data.ret === 1) {
              // this.productList[index].U_MaxPicPath = '/api' + data.pathImage;
              this.$router.go(0);
              this.$toast("上传成功", "success");
            } else if (data.ret === -1) {
              this.$toast("图片为空", "error");
            } else {
              this.$toast("上传失败", "error");
            }
          })
          .catch(error => this.$toast("上传失败", "error"));
      });
    },
    deletePr() {},
    showBigImg(index) {
      this.$photoPreview.open(0, [this.productList[index]]);
    },
    detailPr(index) {
      let formdata = new FormData();
      formdata.append("userCode", localStorage.getItem("UserCode"));
      formdata.append("docEntry", this.productList[index].DocEntry);
      formdata.append("lineId", this.productList[index].LineId);
      formdata.append("action", "ReceiveDetailPr");
      this.$store.dispatch("receiveDetailPr", formdata).then(() => {
        this.detailShow = true;
      });
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.p-content-box {
  display: flex;
  flex-wrap: wrap;
  .p-content-item {
    position: relative;
    background-color: #fff;
    box-shadow: 0px 0px 5px 0px rgba(38, 42, 48, 0.1);
    padding: 15px 10px;
    margin-bottom: 10px;
    // margin-right: 5px;
    width: 27%;
    @media screen and (max-width: 768px) {
      padding: 8px;
      width: 100%;
    }
    display: flex;
    &:hover {
      background-color: rgba(242, 242, 242, 0.2);
      box-shadow: 0px 3px 4px -2px #ccc;
    }
    .img-container {
      position: relative;
      width: 40%;
      padding-top: 40%;
      height: 0px;
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
    .info-container {
      flex: 1;
      padding-left: 10px;
      font-size: 12px;
      .info-item {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        overflow: hidden;
      }
    }
    .btn-edit {
      position: absolute;
      right: 6px;
      bottom: 6px;
      font-size: 12px;
      color: #79a5e5;
      display: none;
      > div {
        display: inline;
        padding-right: 7px;
        cursor: pointer;
      }
      .edit {
        position: relative;
        .originInp {
          position: absolute;
          font-size: 1px;
          left: 0;
          top: 0;
          opacity: 0;
          filter: alpha(opacity=0);
          cursor: pointer;
        }
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
  .magnify-img {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .imgbox {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
}
</style>