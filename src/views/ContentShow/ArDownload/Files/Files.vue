<template>
  <div class="file-wrap">
    <div class="file-box">
      <div class="operation-box" v-if="showEdit && isPc && tabSwitch == 0">
        <ul class="operation-ul">
          <li class="upload">
            <uploader 
                    ref="uploader"
                    :options="options"
                    :autoStart="false"
                    @file-added="onFileAdded"
                    @file-success="onFileSuccess"
                    @file-progress="onFileProgress"
                    @file-error="onFileError"
                    class="uploader-app">
              <uploader-unsupport></uploader-unsupport>
              <uploader-btn class="up-btn"><i class="iconfont">&#xe612;</i>&nbsp;&nbsp;上&nbsp;&nbsp;传</uploader-btn>
              <uploader-list v-show="panelShow">
                <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                    <div class="file-title">
                        <h2>文件列表</h2>
                        <div class="operate">
                            <el-button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">
                                <i class="iconfont" :class="collapse ? 'inuc-fullscreen': 'inuc-minus-round'"></i>展开
                            </el-button>
                            <el-button @click="close" type="text" title="关闭">
                                <i class="iconfont icon-close"></i>关闭
                            </el-button>
                        </div>
                    </div>
                    <ul class="file-list">
                        <li v-for="file in props.fileList" :key="file.id">
                            <uploader-file class="up-file" :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
                        </li>
                        <div class="no-file" v-if="!props.fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
                    </ul>
                </div>
              </uploader-list>
            </uploader>
          </li>
          <li @click="newFile">新建文件夹</li>
        </ul>
      </div>
      <div class="content-box">
        <div class="bread-box">
          <el-breadcrumb separator="/" v-show="breadArr.length">
            <el-breadcrumb-item
              v-for="(item, index) in breadArr"
              :key="index"
              :to="item.path"
            >{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="new-box" v-show="isNew">
          <input type="text" class="newName" v-model="newName">
          <div @click="submitFile" class="btn left">√</div>
          <div @click="quxiaoFile" class="btn right">×</div>
        </div>
        <div class="file-items">
          <div
            class="file-item"
            :data-kind="item.code"
            :data-path="item.path"
            :data-type="item.type"
            v-for="(item, index) in fileArrs"
            :key="index"
            @click="selectFile($event,index)"
          >
            <span class="select"></span>
            <img class="logo" :src="item.ico">
            <a class="file-title" v-if="item.type == 'dir'" @click.stop="lookFile($event,index)">{{item.name}}</a>
            <a class="file-title" v-else :href="'/api'+item.path" target="_blank">{{item.name}}</a>
            <div class="action-btn">
              <div class>下载</div>
              <div @click="delectFile($event)" class>删除</div>
            </div>
          </div>
          <no-data
            v-if="fileArrs.length === 0 && isNew === false"
            text="暂无下载资料~"/>
        </div>
      </div>
    </div>
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
import HintInfo from "../../../../components/HintInfo/HintInfo";
import NoData from "../../../../components/NoData/NoData";
import { mapState } from "vuex";
import { RECEIVE_FILES } from "../../../../store/mutation-types";
import SparkMD5 from 'spark-md5';
import $ from 'jquery';
export default {
  props: ["isPc", "showEdit"],
  data() {
    return {
      options: {
        target: '/api/service/DOC_DataHandle.ashx',
        chunkSize: 1024 * 1024,
        fileParameterName: 'upfile',
        maxChunkRetries: 3,
        testChunks: false,   //是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        // checkChunkUploadedByResponse: function (chunk, message) {
        //   let objMessage = JSON.parse(message);
        //   if (objMessage.skipUpload) {
        //       return true; // return true 会忽略当前文件，不会再发送给后台
        //   }
        //   console.log((objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0, chunk)
        //   return (objMessage.uploaded ? objMessage.uploaded.split(',') : []).indexOf(chunk.offset + 1) >= 0; // return false会上传当前分片
        // }
      },
      attrs: {
        accept: 'image/*'
      },
      panelShow: false,   //选择文件后，展示上传panel
      collapse: false,   //是否将上传列表展开
      params: {}, //上传文件的额外参数
      typeArr: ["dir", "docs", "imgs", "vids"],
      dialogVisible: false, // 是否显示删除提示框
      pubsubEvent: "folderDelet", //发布订阅事件名
      tabSwitch: -1, //记录分类
      fileArrs: [], //记录文件信息
      lastArr: [], //记录上一层的文件信息
      fileArrOne: [], //第一层筛选
      isNew: false, //是否显示新建框
      newName: "新建文件夹", //新建文件夹的名字
      currentUrl: "", //当前路由
      isWatch: false, //是否执行监听路由变化
      breadArr: [], //面包屑数组
      deleCode: '', //要删除的文件code
      delePath: '', //要删除的文件路径
      deleType: '', //要删除的文件类型
    };
  },
  components: {
    HintInfo,
    NoData
  },
  computed: {
    ...mapState(["files"]),
    uploader() {
      return this.$refs.uploader.uploader;
    }
  },
  watch: {
    $route(to, from) {
      if (this.isWatch) {
        this.currentUrl = to;
        let type = to.query.type;
        let path = to.query.path;
        let pathLen = path.split("/");
        this.breadArr = [];
        if (pathLen.length >= 2) {
          let breadPath = to.fullPath.split("&")[0];
          pathLen.forEach((item, index) => {
            if (index == 0) {
              breadPath += "&path=" + item;
              this.breadArr.push({
                path: breadPath,
                name: "全部文件"
              });
            } else {
              breadPath += "/" + item;
              let na;
              this.fileArrOne.forEach(items => {
                if (items.code == item) {
                  na = items.name;
                }
              });
              this.breadArr.push({
                path: breadPath,
                name: na
              });
            }
          });
        }
        this._filterArr(type, path);
      }
    },
    files(value) {
      let type = this.$route.query.type;
      let path = this.$route.query.path;
      this._filterArr(type, path);
    }
  },
  created() {
    //订阅关闭对话框事件
    PubSub.subscribe(this.pubsubEvent, (event, e) => {
      if (e) {
        let formdata = new FormData();
        formdata.append('action', 'DelectFile');
        formdata.append('path', this.delePath);
        formdata.append('code', this.deleCode);
        formdata.append('type', this.deleType);
        formdata.append('UserCode', localStorage.UserCode);
        this.$store.dispatch('delectFile', formdata).then(data => {
          this.dialogVisible = false;
          if(data >= 1) {
            let faArr = this.fileArrOne;
            let indexArr = [];
            let co = this.deleCode;
            let coLen = co.length;
            this.fileArrOne.forEach((item, index) => {
              let i = item.code.toString().substr(0, coLen);
              if(i != co) {
                indexArr.push(item);
              }
            })
            this.$store.commit(RECEIVE_FILES, indexArr);
            this.$toast('成功删除', 'success');
          } else if(data == -1) {
            this.$toast('您要删除的文件（夹）不存在', 'error');
          } else {
            this.$toast('删除失败', 'error');
          }
        }).catch(error => {
          this.dialogVisible = false;
          this.$toast(error, "error");
        });
      } else {
        this.dialogVisible = e;
      }
    });
  },
  mounted() {
    //请求数据
    let formData = new FormData();
    formData.append("action", "ReceiveFiles");
    formData.append("UserCode", localStorage.getItem("UserCode"));
    this.$store.dispatch("receiveFiles", formData).then(data => {
      let type = this.$route.query.type;
      let path = this.$route.query.path;
      this._filterArr(type, path);
      this.isWatch = true;
    });
  },
  methods: {
    lookFile(e, index) {
      if (this.isNew) {
        return;
      }
      let type = e.path[1].dataset.type;
      if(type == 'dir') {
        let kind = e.path[1].dataset.kind; //作为下一级的kind
        let path = this.$route.query.path; //url里的path参数是下一级的kind，本级的code
        let pathStr = path + "/" + kind;
        this.$router.push({
          path: "/content/ardownload/files",
          query: {
            type: this.tabSwitch,
            path: pathStr
          }
        });
      } 
    },
    selectFile(e, index) {
      if (this.isNew) {
        return;
      }
    },
    _filterArr(type, path) {
      this.tabSwitch = type;
      let kind;
      if (path === "1") {
        kind = "1";
      } else {
        let kindArr = path.split("/");
        kind = kindArr[kindArr.length - 1];
      }
      this.fileArrOne = this.files;
      if (type == 0) {
        if(this.fileArrOne.length == 0) {
          this.fileArrs = [];
        } else {
          this.fileArrs = this.fileArrOne.filter(function(item, index) {
            return item.kind == kind;
          });
        }
        if (this.fileArrs.length === 0) {
          if (path === "1") {
            this.lastArr = [];
          } else {
            if(this.fileArrOne.length == 0) {
              this.lastArr = [];
            } else {
              this.lastArr = this.fileArrOne.filter(function(item, index) {
                return item.code == kind;
              });
            }
          }
        }
      } else {
        let tp = this.typeArr[type];
        if(this.fileArrOne.length == 0) {
          this.fileArrs = [];
        } else {
          this.fileArrs = this.fileArrOne.filter(function(item, index) {
            return item.type == tp;
          });
        }
      }
    },
    newFile() {
      this.isNew = true;
      this.$nextTick(function() {
        document.getElementsByClassName("newName")[0].select();
      });
    },
    quxiaoFile() {
      this.newName = "新建文件夹";
      this.isNew = false;
    },
    submitFile() {
      if (this.newName == "") {
        this.$toast("请填写文件夹名称", "error");
        document.getElementsByClassName("newName")[0].focus();
        return;
      }
      let path, code, kind, pPath;
      if (this.fileArrs.length === 0 && this.lastArr.length === 0) {
        path = this.newName;
        code = "1001";
        kind = "1";
        pPath = "";
      } else if (this.fileArrs.length === 0 && this.lastArr.length !== 0) {
        path = this.lastArr[0].path.split("/").slice(2).join("/") + "/" + this.newName;
        code = this.lastArr[0].code + "001";
        kind = this.lastArr[0].code;
        pPath = this.lastArr[0].path;
      } else {
        path = this.fileArrs[0].pPath ? this.fileArrs[0].pPath.split("/").slice(2).join("/") + "/" + this.newName : this.newName;
        let codeitem = this.fileArrs.reduce(function(init, item) {
          return init > item.code ? init : item.code;
        }, 0);
        code = parseInt(codeitem) + 1;
        kind = this.fileArrs[0].kind;
        pPath = this.fileArrs[0].pPath;
      }
      let formdata = new FormData();
      formdata.append("action", "SaveFolder");
      formdata.append("path", path);
      formdata.append("UserCode", localStorage.UserCode);
      formdata.append("code", code);
      formdata.append("name", this.newName);
      formdata.append("type", "dir");
      formdata.append("kind", kind);
      formdata.append("pPath", pPath);
      formdata.append("extend", "");
      formdata.append("ico", "/image/folder.png");
      this.$store
        .dispatch("saveFolder", formdata)
        .then(data => {
          if (data >= 1) {
            this.$toast("创建文件夹成功", "success");
            this.fileArrOne.push({
              code: code,
              name: this.newName,
              type: "dir",
              kind: kind,
              pPath: pPath,
              ico: "/image/folder.png",
              path: "/DOC_ArDownload/" + path,
              extend: ""
            });
            this.$store.commit(RECEIVE_FILES, this.fileArrOne);
            this.isNew = false;
          } else if (data == -1) {
            this.$toast("文件夹名字重复", "error");
          } else {
            this.$toast("创建文件夹失败", "error");
          }
        })
        .catch(error => {
          this.$toast(error, "error");
        });
    },
    delectFile(e) {
      this.delePath = e.path[2].dataset.path.split("/").slice(2).join("/");
      this.deleCode = e.path[2].dataset.kind;
      this.deleType = e.path[2].dataset.type;
      this.dialogVisible = true;
    },
    uploadFileParams(upFile) {
      // let files = e.srcElement.files;
      // if (!files.length) return; //文件长度大于0
      // let upFile = files[0];
      let name = upFile.name;
      let extend = name.split('.')[1];
      let type = 'docs';
      let ico = '/image/file.png'
      if(upFile.type.includes('image')) {
        type = 'imgs';
        ico = '/image/imgs.png';
      } else if(upFile.type.includes('video')) {
        type = 'vids';
        ico = '/image/video.png';
      } else if(extend.toLowerCase().includes('doc')) {
        ico = '/image/WORD.png';
      } else if(extend.toLowerCase().includes('xl')) {
        ico = '/image/Excel.png';
      } else if(extend.toLowerCase().includes('ppt')) {
        ico = '/image/ppt.png';
      } else if(extend.toLowerCase().includes('pdf')) {
        ico = '/image/PDF.png';
      } else if(extend.toLowerCase().includes('txt')) {
        ico = '/image/txt.png';
      } else if(extend.toLowerCase().includes('rar')) {
        ico = '/image/zip.png';
      } else if(extend.toLowerCase().includes('zip')) {
        ico = '/image/zip.png';
      }
      let path, code, kind, pPath;
      if (this.fileArrs.length === 0 && this.lastArr.length === 0) {
        path = name;
        code = "1001";
        kind = "1";
        pPath = "";
      } else if (this.fileArrs.length === 0 && this.lastArr.length !== 0) {
        path = this.lastArr[0].path.split("/").slice(2).join("/") + "/" + name;
        code = this.lastArr[0].code + "001";
        kind = this.lastArr[0].code;
        pPath = this.lastArr[0].path;
      } else {
        path = this.fileArrs[0].pPath ? this.fileArrs[0].pPath.split("/").slice(2).join("/") + "/" + name : name;
        let codeitem = this.fileArrs.reduce(function(init, item) {
          return init > item.code ? init : item.code;
        }, 0);
        code = parseInt(codeitem) + 1;
        kind = this.fileArrs[0].kind;
        pPath = this.fileArrs[0].pPath;
      }
      this.params.action = "SaveUpFile";
      this.params.path = path;
      this.params.UserCode = localStorage.UserCode;
      this.params.code = code;
      this.params.name = name;
      this.params.type = type;
      this.params.kind = kind;
      this.params.pPath = pPath;
      this.params.extend = extend;
      this.params.ico = ico;
    },
    onFileAdded(file) {
      this.panelShow = true;
      this.computeMD5(file);
    },
    onFileProgress(rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      // 服务器自定义的错误，这种错误是Uploader无法拦截的
      if (!res.result) {
        this.$toast(res.message, 'error');
        return
      }
      console.log(res);
      //如果服务端返回需要合并
      if (res.needMerge) {
        this.params.action = 'Merge';
        let formData = new FormData();
        formData.append('action', 'Merge');
        formData.append('path', this.params.path);
        formData.append('UserCode', this.params.UserCode);
        formData.append('code', this.params.code);
        formData.append('name', this.params.name);
        formData.append('type', this.params.type);
        formData.append('kind', this.params.kind);
        formData.append('pPath', this.params.pPath);
        formData.append('extend', this.params.extend);
        formData.append('ico', this.params.ico);
        formData.append('tempName', res.tempName);
        formData.append('totalCh', res.totalCh);
        this.$store.dispatch('merge', formData).then(data => {
          // 文件合并成功
          if (data >= 1) {
            this.$toast("文件上传成功！", "success");
            this.fileArrOne.push({
              code: this.params.code,
              name: this.params.name,
              type: this.params.type,
              kind: this.params.kind,
              pPath: this.params.pPath,
              ico: this.params.ico,
              path: "/DOC_ArDownload/" + this.params.path,
              extend: this.params.extend
            });
            this.$store.commit(RECEIVE_FILES, this.fileArrOne);
            this.isNew = false;
          } else {
            this.$toast("上传文件失败", "error");
          }
        }).catch(e => {
          this.$toast(e, "error");
        });
      // 不需要合并
      } else {
        this.$toast("文件上传成功！", "success");
        this.fileArrOne.push({
          code: this.params.code,
          name: this.params.name,
          type: this.params.type,
          kind: this.params.kind,
          pPath: this.params.pPath,
          ico: this.params.ico,
          path: "/DOC_ArDownload/" + this.params.path,
          extend: this.params.extend
        });
        this.$store.commit(RECEIVE_FILES, this.fileArrOne);
        this.isNew = false;
      }
    },
    onFileError(rootFile, file, response, chunk) {
      this.$toast(response,'error');
    },
    computeMD5(file) {
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let md5 = '';
      file.pause();
      fileReader.readAsArrayBuffer(file.file);
      fileReader.onload = (e => {
        if (file.size != e.target.result.byteLength) {
            this.$toast('Browser reported success but could not read the file until the end.','error');
            return
        }
        md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
        this.uploadFileParams(file.file);
        // 添加额外的参数
        this.uploader.opts.query = {
            ...this.params
        }
        console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms`);
        file.uniqueIdentifier = md5;
        file.resume();
      });
      fileReader.onerror = function () {
        this.$toast('FileReader onerror was triggered, maybe the browser aborted due to high memory usage.','error');
      };
    },
    fileListShow() {
      let $list = $('.file-list');
      if ($list.is(':visible')) {
        $list.slideUp();
        this.collapse = true;
      } else {
        $list.slideDown();
        this.collapse = false;
      }
    },
    close() {
      this.uploader.cancel();
      this.panelShow = false;
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.file-wrap {
  .file-box {
    position: absolute;
    top: -8px;
    left: 19%;
    width: 79%;
    font-size: 14px;
    @media screen and (max-width: 768px) {
      top: 12px;
      left: 10px;
      width: 90%;
    }
    // border: 1px solid black;
    .operation-ul {
      // position: fixed;
      width: 100%;
      height: 50px;
      line-height: 50px;
      > li {
        display: inline-block;
        width: 89px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        margin: 5px 10px;
        border: 1px solid #b7daff;
        border-radius: 5px;
        color: #898989;
        cursor: pointer;
        &:hover {
          color: #333;
          background-color: rgba(183, 218, 255, 0.1);
        }
      }
      .upload {
        position: relative;
        .uploader-app {
          .drop-btn {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100000;
            font-size: 30px;
            color: #898989;
            text-align: center;
            vertical-align: center;
          }
          .up-btn {
            // position: absolute;
            // font-size: 1px;
            // left: 0;
            // top: 0;
            // width: 89px;
            // height: 31px;
            // opacity: 0;
            // filter: alpha(opacity=0);
            // cursor: pointer;
            outline: none;
            -webkit-appearance: none; 
            -moz-appearance: none; 
            -o-appearance: none; 
            appearance: none;
            outline: none;
            border-color:transparent;
            background-color:transparent;
          }
          .file-panel {
            position: fixed;
            z-index: 20;
            right: 15px;
            bottom: 15px;
            width: 555px;
            background-color: #fff;
            border: 1px solid #e2e2e2;
            border-radius: 7px 7px 0 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, .2);
            .file-title {
              display: flex;
              height: 40px;
              line-height: 40px;
              padding: 0 15px;
              border-bottom: 1px solid #ddd;
              .operate {
                flex: 1;
                text-align: right;
              }
            }
            .file-list {
              position: relative;
              height: 240px;
              width: 100%;
              overflow-x: hidden;
              overflow-y: auto;
              background-color: #fff;
              line-height: 10px;
              > li {
                background-color: #fff;
                width: 100%;
                text-align: left;
                .up-file {
                  width: 100%;
                  height: 49px;
                  .uploader-file-icon {
                    background-color: #000;
                    &:before {
                      content: '' !important;
                    }
                    &[icon='image'] {
                      // background-image: url('/image/imgs.png');
                      background-color: #000;
                    }
                    &[icon='video'] {
                      background-image: url('/image/video.png');
                    }
                    &[icon='document'] {
                      background-image: url('/image/file.png');
                    }
                  }
                }
              }
              .no-file {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 16px;
              }
            }
            &.collapse {
              .file-title {
                background-color: #E7ECF2;
              }
            }
          }
        }
      }
    }
    .content-box {
      .bread-box {
        padding-left: 15px;
        padding-top: 8px;
        padding-bottom: 5px;
        font-size: 6px;
        color: #898989;
      }
      .new-box {
        position: relative;
        padding-left: 15px;
        margin-top: 10px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        .newName {
          height: 25px;
          line-height: 25px;
          border: 1px solid #b7daff;
          border-radius: 5px;
          padding-left: 5px;
        }
        .btn {
          position: absolute;
          top: 7px;
          left: 205px;
          width: 25px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border: 1px solid #b7daff;
          border-radius: 5px;
          cursor: pointer;
          &.right {
            left: 240px;
          }
        }
      }
      .file-items {
        width: 100%;
        .file-item {
          width: 100%;
          height: 50px;
          line-height: 50px;
          padding-left: 15px;
          position: relative;
          .select {
            position: absolute;
            top: 18px;
            left: 10px;
            width: 10px;
            height: 10px;
            border: 1px solid #ccc;
          }
          .logo {
            position: absolute;
            width: 22px;
            height: 22px;
            top: 12px;
            left: 40px;
          }
          .file-title {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis; 
            white-space: nowrap; 
            width: 100%;
            padding-left: 60px;
            box-sizing: border-box;
            color: #898989;
            cursor: pointer;
            &:hover {
              color: #008dff;
            }
          }
          .action-btn {
            position: absolute;
            top: 0px;
            right: 20px;
            display: none;
            div {
              display: inline-block;
              margin-left: 10px;
              font-size: 14px;
              color: #79a5e5;
              cursor: pointer;
            }
          }
          &:hover {
            background-color: rgba(183, 218, 255, 0.1);
            .action-btn {
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
}
</style>