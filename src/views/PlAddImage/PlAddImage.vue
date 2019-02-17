<template>
  <div class="image-box">
    <div class="input-box">
      <el-input v-model="docEntry" placeholder="请输入单号"></el-input>
      <el-input v-model="lineId" placeholder="请输入行号"></el-input>
    </div>
    <div class="file-box">
      <input type="file" accept="image/*" @change="imageHandle">
      <img class="img" ref="upImg">
    </div>
  </div>
</template>

<script>
import UploadImg from "../../util/uploadImg";
export default {
  data() {
    return {
      docEntry: "",
      lineId: ""
    };
  },
  methods: {
    imageHandle(e) {
      let maxSize = 100 * 1024;
      let imgDom = this.$refs.upImg;
      let files = e.srcElement.files;
      if (!files.length) return; //文件长度大于0
      if (!/^image\//.test(files[0].type)) return; //必须是图片才处理
      if (!window.FileReader) return; //支持FileReader

      if (this.docEntry === "" || this.lineId === "") {
        this.$toast("请填写完整信息", "error");
        return;
      }
      // let formdata = new FormData();
      UploadImg.imageHandle(files, maxSize, imgDom).then(formdata => {
        formdata.append("docEntry", this.docEntry);
        formdata.append("lineId", this.lineId);
        formdata.append("action", "ProductionListImage");
        this.$store
          .dispatch("uploadImage", formdata)
          .then(data => {
            if (data === 1) {
              this.$toast("上传成功", "success");
            } else if (data === -1) {
              this.$toast("图片为空", "error");
            } else {
              this.$toast("上传失败", "error");
            }
          })
          .catch(error => this.$toast("上传失败", "error"));
      });
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.image-box {
  width: 50%;
  height: 60%;
  margin: 80px auto 10px;
  .input-box {
    margin: auto;
    width: 50%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .file-box {
    width: 50%;
    margin: 30px auto;
    .img {
      display: block;
      margin-top: 20px;
      max-width: 50%;
    }
  }
}
</style>