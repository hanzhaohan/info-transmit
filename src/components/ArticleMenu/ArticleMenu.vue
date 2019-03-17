<template>
  <ul class="article-menu">
    <li v-for="item in menu" :key="item.tag">
      <span @click="toMenu(item)" :class="{'active': is(item) || isParent(item)}">{{ item.tag }} {{ item.title }}</span>
      <article-menu :menu="item.children" />
    </li>
  </ul>
</template>

<script>
  import ArticleMenu from './ArticleMenu.vue'
  import {scroll} from '../../mixins/scroll'
  export default {
    name: 'article-menu',
    props: ['menu','menuTag'],
    mixins: [scroll],
    data() { 
      return {}
    },
    components: {
        ArticleMenu
    },
    methods: {
        toMenu(item) {
            let top = document.getElementById(item.id).getBoundingClientRect().top
            top += document.body.scrollTop || document.documentElement.scrollTop
            this.scrollToTarget(top)
        },
        is (item) {
            return item.tag === this.menuTag;
        },
        isParent (item) {
            return typeof(this.menuTag)!='undefined' ? this.menuTag.indexOf(item.tag) === 0 : '1.'.indexOf(item.tag)===0;
        }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .article-menu{
    width: 100%;
    line-height: 1.8;
    font-weight: bold;
    font-size: 14px;
    color: #999;
    > li{
        margin-left: 10px;
        > span{
            cursor: pointer;
            transition: all .3s;
            border-bottom: 1px solid #555555;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display:inline-block;
            max-width:100%;
            &.active,
            &:hover{
                color: #333;
            }
        }
    }
  }
  
</style>