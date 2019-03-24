// import 'babel-polyfill'
require('es6-promise').polyfill()
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//按需引入element UI
import { Button, Input, Dialog, Select, Option, Collapse, Breadcrumb, BreadcrumbItem, Tree } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Dialog.name, Dialog)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Collapse.name, Collapse)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(BreadcrumbItem.name, BreadcrumbItem)
Vue.component(Tree.name, Tree)
// Vue.component(Loading.name, Loading)
import { Message } from 'element-ui'
//引入时间过滤器
import './util/filters'
//引入时间格式化插件
import DateFns from 'date-fns/format'
//引入iconfont字体图表
import './common/lesses/font.less'
// import preview from 'vue-photo-preview'
// import 'vue-photo-preview/dist/skin.css'

// import VuePreview from 'vue2-preview'

import photoPreview from './components/photoPreview'
import uploader from 'vue-simple-uploader'

// Vue.use(VuePreview)
// Vue.use(preview)
Vue.use(photoPreview)
Vue.use(uploader)

Vue.config.productionTip = false

Vue.toast = Vue.prototype.$toast = (msg, type = 'success') => {
  Message({
    showClose: true,
    message: msg,
    type: type,
    duration: 2000
  })
}
Vue.dateFilter = Vue.prototype.$dateFilter = (value, formatStr='YYYY-MM-DD HH:mm:ss') => {
  return DateFns(value, formatStr)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
