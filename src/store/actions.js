import {
    uploadImage,
    publishArticle,
    saveArticle,
    loginConfirm,
    receiveCont,
    deleteAr,
    receiveDetail,
    receiveDetailPr,
    receivePrClassify,
    receiveHpClassify,
    receiveHpTitle,
    readLoginConfirm,
    receiveFiles,
    saveFolder,
    delectFile,
    merge
} from '../api'

import {
    RECEIVE_LOGININFO,
    SAVE_LOGININFO,
    EXIT,
    RECEIVE_NEWINFO,
    RECEIVE_HELPARTICLE,
    RECEIVE_ARDOWNLOAD,
    RECEIVE_PRODUCTLIST,
    RECEIVE_DETAIL_PRODUCTLIST,
    RECEIVE_PRODUCTLIST_CLASSIFY,
    RECEIVE_HELP_CLASSIFY,
    RECEIVE_HELP_TITLE,
    RECEIVE_READLOGININFO,
    RECEIVE_FILES
} from './mutation-types'

export const actions = {
    //上传图片
    uploadImage({ commit }, param) {
        return uploadImage(param)
    },
    //发布文章
    publishArticle({ commit }, param) {
        return publishArticle(param)
    },
    //保存文章
    saveArticle({ commit }, param) {
        return saveArticle(param)
    },
    //登录
    async loginConfirm({ commit }, param) {
        let infoobj = {};
        let result = await loginConfirm(param);
        if (result[0].UserCode !== "-1") {
            localStorage.setItem("Company", result[0].Company);
            localStorage.setItem("DepName", result[0].DepName); //部门
            localStorage.setItem("UserCode", result[0].UserCode); //账号
            localStorage.setItem("UserName", result[0].UserName); //用户名
            localStorage.setItem("Dept", result[0].Dept); //部门编号
            const info = result[0];
            commit(RECEIVE_LOGININFO, { info });
            infoobj.id = 1;
            infoobj.content = '登录成功';
            return infoobj;
        }
        else {
            infoobj.id = 0;
            infoobj.content = result[0].UserName;
            return infoobj;
        }
    },
    //页面初始化将登录信息保存到state中
    saveLogin({ commit }, param) {
        commit(SAVE_LOGININFO, param);
    },
    //退出登录
    exit({ commit }) {
        commit(EXIT);
    },
    //获取页面展示内容(最新消息)
    async receiveCont({ commit }, param) {
        let result = await receiveCont(param);
        let id = param.get('Id');
        if (id === 'nf') {
            commit(RECEIVE_NEWINFO, { result });
        } else if (id === 'hw') {
            commit(RECEIVE_HELPARTICLE, { result });
        } else if (id === 'ad') {
            commit(RECEIVE_ARDOWNLOAD, { result });
        } 
    },
    //获取页面展示内容(产品清单)
    async receiveContPr({ commit }, param) {
        let result = await receiveCont(param);
        commit(RECEIVE_PRODUCTLIST, { result });
        return Promise.resolve(result);
    },
    //删除文章
    deleteAr({ commit }, param) {
        return deleteAr(param);
    },
    //获取文章详情
    receiveDetail({ commit }, param) {
        return receiveDetail(param);
    },
    //获取产品清单详情(产品清单)
    async receiveDetailPr({ commit }, param) {
        let result = await receiveDetailPr(param);
        commit(RECEIVE_DETAIL_PRODUCTLIST, result);
    },
    //获取产品清单分类
    async receivePrClassify({ commit }, param) {
        let result = await receivePrClassify(param);
        commit(RECEIVE_PRODUCTLIST_CLASSIFY, result);
        return Promise.resolve(result);
    },
    //获取帮助文档分类
    async receiveHpClassify({ commit }, param) {
        let result = await receiveHpClassify(param);
        commit(RECEIVE_HELP_CLASSIFY, result);
        return Promise.resolve(result);
    },
    //获取帮助文档标题
    async receiveHpTitle({ commit }, param) {
        let result = await receiveHpTitle(param);
        commit(RECEIVE_HELP_TITLE, result);
        return Promise.resolve(result);
    },
    //阅读密钥
    async readLoginConfirm({ commit }, param) {
        let result = await readLoginConfirm(param);
        if(result[0].IsOk == '1') {
            commit(RECEIVE_READLOGININFO, true);
        } else {
            commit(RECEIVE_READLOGININFO, false);
        }
        return result[0].IsOk;
    },
    //获取文件信息
    async receiveFiles({ commit }, param) {
        let result = await receiveFiles(param);
        commit(RECEIVE_FILES, result);
        return result;
    },
    //保存文件夹
    async saveFolder({ commit }, param) {
        let result = await saveFolder(param);
        return result;
    },
    //删除文件夹/文件
    async delectFile({ commit }, param) {
        let result = await delectFile(param);
        return result;
    },
    //合并文件
    async merge({ commit }, param) {
        let result = await merge(param);
        console.log(result)
        return result;
    }
}