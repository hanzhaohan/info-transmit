import Vue from 'vue'
import Vuex from 'vuex'

import admin from './modules/admin'
import common from './modules/common'
import front from './modules/front'

Vue.use(Vuex)

const modules = {admin, common, front}
export default new Vuex.Store({
    modules
})