<template>
  <div class="wrapper">
    <div class="editor-header">
      <input class="title" type="text" v-model="article.title" placeholder="输入文章标题">
      <el-button type="danger" size="medium" @click="publish">发布文章</el-button>
    </div>
    <mavon-editor
      ref="md"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
      @save="saveFile"
      v-model="article.contentMd"
    />
    <ArticleInfo
      v-show="infoShow"
      @close="close"
      @arPublish="arPublish"
      :valueA="this.markArticle[this.id] ? this.markArticle[this.id].U_DocType : ''"
      :valueB="this.markArticle[this.id] ? this.markArticle[this.id].U_Type1 : ''"
      :valueC="this.markArticle[this.id] ? this.markArticle[this.id].U_Auther : ''"
    />
    <HintInfo
      :dialog-visible="dialogVisible"
      :eventName="pubsubEvent"
      hint="发布成功！"
      btn1="写新文章"
      btn2="查看文章"
    />
  </div>
</template>

<script>
//引入mavonEditor编辑模板
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
//引入工具markdown-it
import MarkdownIt from "../../util/markdownIt";

import ArticleInfo from "../../components/ArticleInfo/ArticleInfo";
import HintInfo from "../../components/HintInfo/HintInfo";
import qiniufile from "../../util/qiniufile";
import uuid from "../../util/uuid"
import { mapState, mapActions } from "vuex";

export default {
  mixins: [MarkdownIt], //混入
  data() {
    return {
      article: {
        title: "", //文章标题
        contentMd: "" //文章内容MD
      },
      infoShow: false, //是否显示弹窗组件
      classify: "",
      id: -1,
      markArticle: [],
      dialogVisible: false, // 是否显示发布成功提示框
      classifyAr: "", //当前发布文章的分类(用于文章发布完直接查看文章)
      hpClassify: "", //当前发布文章的帮助文档分类(用于文章发布完直接查看文章)
      limitAr: "", //当前发布文章的文章权限(用于文章发布完直接查看文章)
      docEntry: 0, //当前发布文章的唯一标识符(用于文章发布完直接查看文章)
      pubsubEvent: "mdPublish" //发布订阅事件名
    };
  },
  components: {
    mavonEditor,
    ArticleInfo,
    HintInfo
  },
  created() {
    //初始化
    this.classify = this.$route.query.classify;
    if (this.classify === "nf") {
      this.markArticle = this.newInfo;
    } else if (this.classify === "hw") {
      this.markArticle = this.hpContent;
    }
    this.id = this.$route.query.id;
    if (this.id >= 0) {
      this.article.title = this.markArticle[this.id].U_Title;
      this.article.contentMd = this.markArticle[this.id].U_ContentMd;
    }
    //订阅关闭对话框事件
    PubSub.subscribe(this.pubsubEvent, (event, e) => {
      if (e) {
        this.dialogVisible = !e;
        this.$router.replace({
          name: "detail",
          query: {
            classify: this.classifyAr,
            docEntry: this.docEntry
          }
        });
      } else {
        this.dialogVisible = e;
        this.$router.replace("/mdedit");
        this.article.contentMd = "";
        this.article.title = "";
        this.classifyAr = "";
      }
    });
  },
  computed: {
    ...mapState(["newInfo", "hpContent"])
  },
  methods: {
    ...mapActions([
      "uploadImage",
      "publishArticle",
      "saveArticle",
      "receiveToken"
    ]),
    //保存为草稿
    saveFile(value, render) {
      if (this.id >= 0) {
        this.publish();
      } else {
        let formdata = this._getParams();
        formdata.append("action", "SaveArticle");
        formdata.append("status", 0);
        this.saveArticle(formdata)
          .then(data => {
            if (data === 1) {
              this.$toast("已保存至草稿箱", "success");
            } else {
              this.$toast("保存失败", "error");
            }
          })
          .catch(error => this.$toast(error, "error"));
      }
    },
    //弹窗
    publish() {
      let formdata = this._getParams();
      if (!formdata.get("title")) {
        this.$toast("文章标题不能为空", "error");
        return;
      }
      if (!formdata.get("contentMd")) {
        this.$toast("文章内容不能为空", "error");
        return;
      }
      this.infoShow = true;
    },
    //响应自定义发布事件
    arPublish(e) {
      this.classifyAr = e.classifyValue;
      this.hpClassify = e.hpValue;
      this.limitAr = e.limitValue;
      let formdata = this._getParams();
      formdata.append("action", "PublishArticle");
      formdata.append("classifyValue", e.classifyValue);
      formdata.append("hpClassify", e.hpValue);
      formdata.append("limitAr", e.limitValue);
      formdata.append("status", 1);
      if (this.id >= 0) {
        formdata.append("docEntry", this.markArticle[this.id].DocEntry);
      }
      this.publishArticle(formdata)
        .then(data => {
          if (data[0] && data[0].DocEntry) {
            this.infoShow = false;
            this.docEntry = data[0].DocEntry;
            this.dialogVisible = true;
          } else {
            this.$toast("发布失败", "error");
          }
        })
        .catch(error => this.$toast(error, "error"));
    },
    //获取文章标题等内容
    _getParams() {
      let html = this.markdownIt.render(this.article.contentMd);
      let formdata = new FormData();
      formdata.append("title", this.article.title);
      formdata.append("contentMd", this.article.contentMd);
      formdata.append("contentHtml", html);
      return formdata;
    },
    //保存图片到服务器
    imgAdd(pos, $file) {
      let formdata = new FormData();
      // formdata.append("action", "SaveImage");
      // formdata.append("image", $file);
      // this.uploadImage(formdata)
      //   .then(data => {
      //     if (data.ret === 1) {
      //       this.$refs.md.$img2Url(pos, "/api" + data.pathImage);
      //     } else if (data.ret === -1) {
      //       this.$toast("图片为空", "error");
      //     } else {
      //       this.$toast("上传失败", "error");
      //     }
      //   })
      //   .catch(error => this.$toast("上传失败", "error"));
      formdata.append("action", "QiNiuToken");
      formdata.append("Bucket", "ogahome-doc-article");
      this.receiveToken(formdata)
        .then(data => {
          if (data != "") {
            // let formParams = new FormData()
            // formParams.append('token', data)
            // formParams.append('file', $file)
            // this.uploadImage(formParams).then(data => {
            //   console.log(data)
            // })
            let key = 'article/' + uuid();
            qiniufile.upload($file,key,data).then(res => {
              this.$refs.md.$img2Url(pos, "http://doc.article.ogahome.cn/" + res.key);
            })
          } else {
            this.$toast("获取token失败", "error");
          }
        })
        .catch(error => this.$toast('图片上传失败', "error"));
    },
    imgDel(e) {console.log(e)},
    //关闭弹窗
    close(e) {
      this.infoShow = e;
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.wrapper {
  margin-top: 80px;
  .editor-header {
    padding-left: 25px;
    height: 40px;
    .title {
      width: 85%;
      height: 25px;
      outline: none;
      border: none;
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>