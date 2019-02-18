<template>
  <div class="article-box">
    <div class="title">{{title}}</div>
    <link href="//cdn.bootcss.com/github-markdown-css/2.4.1/github-markdown.css" rel="stylesheet">
    <div id="markdown-preview-body" class="v-show-content scroll-style preview markdown-body" v-html="htmls"></div>
    <ToolBar />
    <ReadLogin v-if="isShowReadMark" @readLogin="readLogin"/>
    <no-data
      v-if="htmls.length === 0"
      text="文章丢了~"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
//引入工具markdown-it
// import MarkdownIt from "../../util/markdownIt";
import ToolBar from '../../components/ToolBar/ToolBar'
import NoData from '../../components/NoData/NoData'
import ReadLogin from '../../components/ReadLogin/ReadLogin'
export default {
  // mixins: [MarkdownIt], //混入
  data() {
    return {
      docEntry: 0,
      classify: "",
      title: "",
      htmls: "",
      imgArr: [],
      isShowReadMark: false, //是否显示阅读登录蒙层
      article: {}, //文章信息
    };
  },
  components: {
    ToolBar,
    NoData,
    ReadLogin
  },
  mounted() {
    this.docEntry = this.$route.query.docEntry;
    this.classify = this.$route.query.classify;
    let formdata = new FormData();
    formdata.append("action", "ReceiveDetail");
    formdata.append("docEntry", this.docEntry);
    formdata.append("classify", this.classify);
    formdata.append("userCode", localStorage.getItem("UserCode"));
    this.$store
      .dispatch("receiveDetail", formdata)
      .then(res => {
        this.article = res;
        let auther = res[0].U_Auther;
        if(localStorage.getItem('UserCode')) {
          if(auther != '2') {
            this.htmls = res[0].U_ContentHtml;
            this.title = res[0].U_Title;
            document.getElementsByTagName('title')[0].textContent = this.title;
          } else {
            this.isShowReadMark = true;
          }
        } else {
          if(auther == '0') {
            this.htmls = res[0].U_ContentHtml;
            this.title = res[0].U_Title;
            document.getElementsByTagName('title')[0].textContent = this.title;
          } else {
            // this.$router.push("/login");
            this.$router.push({
              path: '/login',
              query: {
                tag: 'limit'
              }
            });
          }
        }
      })
      .catch(err => this.$toast(err, "error"));
    setTimeout(this.init, 1000);
    // this.$nextTick(this.init)
  },
  methods: {
    init() {
      let imgDomList = document.getElementById('markdown-preview-body').getElementsByTagName('img');
      this.imgArr = [];
      Array.prototype.slice.call(imgDomList,0).forEach((img, index) => {
        img.indexTag = index
        img.onclick = this.showBigImg
        this.imgArr.push({
          src: img.src,
          w: img.width,
          h: img.height,
          target: img
        })
      })
    },
    showBigImg(e) {
      this.$photoPreview.open(e.target.indexTag, this.imgArr);
    },
    readLogin(e) {
      this.$store.dispatch('readLoginConfirm',e).then(info => {
        if(info == '1'){
          this.isShowReadMark = false;
          this.htmls = this.article[0].U_ContentHtml;
          this.title = this.article[0].U_Title;
          document.getElementsByTagName('title')[0].textContent = this.title;
        } else {
          this.$toast(info.content, 'error');
        }}
      ).catch(error => this.$toast(error, 'error'))
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.article-box {
  margin: 80px auto;
  width: 100%;
  overflow-y: auto;
  padding: 0 0;
  transition: all 0.2s linear 0s;
  .title {
    width: 100%;
    height: 100%;
    font-size: 20px;
    @media screen and (max-width: 768px) {
      font-size: 18px;
    }
    font-weight: bold;
    line-height: 1.3em;
    color: #1d1d1d;
    padding-bottom: 20px;
    text-align: center;
    word-wrap: break-word; //换行
    word-break: normal;
  }
  .v-show-content {
    width: 100%;
    height: 100%;
    padding: 8px 18px 15px 20px;
    @media screen and (max-width: 768px) {
      padding: 8px 5px 15px 12px;
    }
    overflow-y: auto;
    box-sizing: border-box;
    overflow-x: hidden;
    background: #fbfbfb;
    line-height: 2.5em;
    font-size: 16px;
    color: #666;
  }
}
.scrollbar() {
  &.scroll-style::-webkit-scrollbar {
    width: 6px;
    background-color: #e5e5e5;
  }
  &.scroll-style::-webkit-scrollbar-thumb {
    background-color: #b7b7b7;
    border-radius: 3px;
  }
  &.scroll-style::-webkit-scrollbar-thumb:hover {
    background-color: #a1a1a1;
  }
  &.scroll-style::-webkit-scrollbar-thumb:active {
    background-color: #a1a1a1;
  }
  &.scroll-style::-webkit-scrollbar-track {
    box-shadow: 0 0 0px gray inset;
  }
}
</style>