import {
    uploadImage,
    publishArticle,
    saveArticle  
} from '../../api'

const state = {

}

const mutations = {

}

const actions = {
    //上传图片
    uploadImage ({commit}, param) {
        return uploadImage (param)
    },
    //发布文章
    publishArticle ({commit}, param) {
        return publishArticle (param)
    },
    //保存文章
    saveArticle ({commit}, param) {
        return saveArticle (param)
    }
}

const getters = {
    
}

export default {
    state,
    mutations,
    actions,
    getters
}