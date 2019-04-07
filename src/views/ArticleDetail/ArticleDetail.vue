<template>
  <div class="article-box">
    <div class="title">{{title}}</div>
    <ArticleMenu :menu=menuTree :menuTag=menuTag />
    <link href="//cdn.bootcss.com/github-markdown-css/2.4.1/github-markdown.css" rel="stylesheet">
    <div id="markdown-preview-body" class="v-show-content scroll-style preview markdown-body" v-html="htmls"></div>
    <ToolBar class="noprint"/>
    <!-- 返回顶部 -->
    <transition name="slide-fade">
      <div class="to-top" @click="scrollToTarget(0)" v-show="showScrollToTop">
        <span
          class="to-top-line"
          v-for="(line, index) in lineData"
          :key="index"
          :style="{
            height: line.height,
            left: line.left,
            transform: line.transform
          }">
        </span>
      </div>
    </transition>
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
import ArticleMenu from '../../components/ArticleMenu/ArticleMenu'
import {scroll} from '../../mixins/scroll'
export default {
  // mixins: [MarkdownIt], //混入
  mixins:[scroll],
  data() {
    return {
      docEntry: 0,
      classify: "",
      title: "",
      htmls: "",
      imgArr: [],
      isShowReadMark: false, //是否显示阅读登录蒙层
      article: {}, //文章信息
      menuSource:[], //所有标题信息并列存储的数组
      menuTree:[], //以树状的形式存储标题信息
      menuTag:'1.',
      lineData: [
        {
          height: '50%',
          left: '3px',
          transform: 'rotateZ(45deg)'
        },
        {
          height: '100%',
          top: '0px',
          transform: 'rotateZ(0deg)'
        },
        {
          height: '50%',
          left: '-3px',
          transform: 'rotateZ(-45deg)'
        }
      ],
      showScrollToTop: false,
    };
  },
  components: {
    ToolBar,
    NoData,
    ReadLogin,
    ArticleMenu
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
    
    window.addEventListener('scroll', this.scrollListener);
  },
  watch: {
    '$route' (to, from) {
      this.docEntry = to.query.docEntry;
      this.classify = to.query.classify;
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
    }
  },
  methods: {
    init() {
      //展示大图
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
      });
      //目录
      this.getMenu();
    },
    showBigImg(e) {
      this.$photoPreview.open(e.target.indexTag, this.imgArr);
    },
    getMenu() {
      let headNodes = document.getElementById('markdown-preview-body').getElementsByClassName('my-blog-head')
      let headList = []
      let pos = 0
      Array.prototype.forEach.call(headNodes, item => {
        headList.push({
          id: item.id,
          index: parseInt(item.tagName.replace('H', '')),
          title: item.innerText
        })
      })
      let tree = this.treeify(headList, 0)
      if (tree.length === 0) {
        tree = false
      }
      let source = JSON.parse(JSON.stringify(headList))
      source.forEach(item => {
        item.children = []
      })
      this.menuSource = source;
      this.menuTree = tree;
    },
    treeify(data, tag) {
      let tree = []
      let index = 0
      data.forEach(item => {
        item.children = []
        let len = tree.length
        if (len === 0) {
          item.tag = tag + (++index) + '.'
          tree.push(item) // 第一个元素，直接放进tree
        } else {
          let last = tree[len - 1]
          if (item.index <= last.index) { // 如果index比tree最后一个的index小或等于，说明是同级存进去
            item.tag = tag + (++index) + '.'
            tree.push(item)
          } else {
            last.children.push(item) // 否则存进最后一个元素的children
          }
        }
      })
      // 因为上面一层循环，只能处理两层，所以需要遍历孩子节点，出现index不一样的说明不是同级，需要对孩子节点再递归调用生成
      tree.forEach(item => {
        let children = item.children
        let ids = []
        index = 0
        // 判断是否存在index不一样的
        children.forEach(child => {
          child.tag = item.tag + (++index) + '.'
          if (ids.indexOf(child.index) === -1) {
            ids.push(child.index)
          }
        })
        if (ids.length > 1) {
          // ids的元素大于1说明存在，需要再递归孩子节点
          item.children = this.treeify(children, item.tag)
        }
      })
      return tree
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
    },
    scrollListener () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= 60) {
        this.showScrollToTop = true
      } else {
        this.showScrollToTop = false
      }
      if (this.menuTree) {
        for (let i = 0, len = this.menuSource.length; i < len; i++) {
          let item = this.menuSource[i];
          let top;
          if(document.getElementById(item.id)){
            top = document.getElementById(item.id).getBoundingClientRect().top
          }
          top += document.body.scrollTop || document.documentElement.scrollTop
          if (scrollTop <= top + 20) {
            this.menuTag=item.tag;
            break
          }
        }
      }
    },
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.article-box {
  margin: 60px auto;
  @media print {
    margin:0px auto;
  }
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
    margin-top:10px;
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
  .noprint{
    @media print {
      display : none
    }
  }
  .to-top{
    position: fixed;
    width: 24px;
    height: 24px;
    background-color: #000;
    right: 50px;
    @media screen and (max-width: 768px){
      right: 10px;
    }
    bottom: 15px;
    padding: 5px;
    z-index: 1050;
    cursor: pointer;
    line-height: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:center;
    .to-top-line{
      position: relative;
      width: 2px;
      height: 100%;
      margin-left: 4px;
      background-color: #fff;
      &:first-child{
        margin-left: 0px;
      }
    }
  }
}
.slide-fade-enter-active{
  transition: all .3s ease;
}
.slide-fade-leave-active{
  transition: all .3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to{
  transform: translateY(20px);
  opacity: 0;
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