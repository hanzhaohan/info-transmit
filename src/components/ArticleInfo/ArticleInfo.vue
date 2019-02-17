<template>
  <div class="info-modal">
    <div class="info-box">
      <h3 class="publish">发布文章</h3>
      <div class="close" @click="close">X</div>
      <div class="content-box">
        <div class="classify">文章分类：
          <el-select v-model="valueAll.classifyValue" clearable placeholder="请选择">
            <el-option
              v-for="item in classifyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="classify" v-show="hpShow">文档分类：
          <el-select v-model="valueAll.hpValue" clearable placeholder="请选择">
            <el-option
              v-for="item in hpClassify"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
        </div>
        <div class="classify">文章权限：
          <el-select v-model="valueAll.limitValue" clearable placeholder="请选择">
            <el-option 
              v-for="item in limitArr" 
              :key="item.Code" 
              :label="item.Name" 
              :value="item.Code"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="btn-box">
        <span @click="close">取消</span>
        <span class="btn-publish" @click="arPublish">发布文章</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["valueA", "valueB", "valueC"],
  data() {
    return {
      classifyOptions: [
        //文章分类
        {
          value: "nf",
          label: "最新消息"
        },
        {
          value: "hw",
          label: "帮助文档"
        }
      ],
      valueAll: {
        classifyValue: "", //第一个选项值
        hpValue: "", //第二个选项值
        limitValue: "",//第三个选项值权限
      },
      hpShow: false, //是否显示帮助文档分类
      hpClassify: [], //帮助文档分类,需要向服务器获取
      // limitArr: ["所有人可见", "需登录", "登录+独立密码"] //权限选择
      limitArr: [{Code:"0",Name:"所有人可见"}, {Code: "1",Name:"需登录"}, {Code:"2",Name:"登录+独立密码"}] //权限选择
    };
  },
  mounted() {
    this.valueAll.classifyValue = this.valueA;
    this.valueAll.hpValue = this.valueB;
    this.valueAll.limitValue = this.valueC;
  },
  watch: {
    valueAll: {
      handler(value) {
        this.hpShow = false;
        if (value.classifyValue === "hw") {
          this.hpShow = true;
          if (this.hpClassify.length === 0) {
            let formData = new FormData();
            formData.append("action", "ReceiveHpClassify");
            formData.append("userCode", localStorage.getItem("UserCode"));
            this.$store
              .dispatch("receiveHpClassify", formData)
              .then(data => (this.hpClassify = data));
          }
        }
      },
      deep: true
    }
  },
  methods: {
    //关闭弹窗
    close() {
      this.$emit("close", false);
    },
    //发布文章
    arPublish() {
      if (!this.valueAll.classifyValue) {
        this.$toast("文章分类不能为空", "error");
        return;
      }
      if (this.valueAll.classifyValue === "hw" && !this.valueAll.hpValue) {
        this.$toast("文档分类不能为空", "error");
        return;
      }
      if (!this.valueAll.limitValue) {
        this.$toast("文章权限不能为空", "error");
        return;
      }
      this.$emit("arPublish", this.valueAll);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.info-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  .info-box {
    position: relative;
    width: 450px;
    height: 300px;
    background-color: #fff;
    color: #4d4d4d;
    padding: 30px 25px;
    .publish {
      color: #3c3c3c;
      font-weight: 600;
    }
    .close {
      position: absolute;
      top: 27px;
      right: 20px;
      color: #ccc;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
      }
    }
    .content-box {
      padding-top: 50px;
      .classify {
        margin-bottom: 5px;
      }
    }
    .btn-box {
      position: absolute;
      right: 30px;
      bottom: 30px;
      span {
        display: inline-block;
        padding: 5px 12px;
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 5px;
        }
      }
      .btn-publish {
        color: #3399ea;
      }
    }
  }
}
</style>