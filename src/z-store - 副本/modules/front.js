import {
    loginConfirm
} from '../../api'

import {
    RECEIVE_LOGININFO
} from '../mutation-types'

const state = {
    loginInfos: {}
}

const mutations = {
    [RECEIVE_LOGININFO] (state, {info}) {
        state.loginInfos = info;
    }
}

const actions = {
    //登录
    async loginConfirm (store, param) {
        let infoobj = {};
        let result = await loginConfirm(param);
        if (result[0].UserCode !== "-1") {
            //localStorage.setItem("Company", result[0].Company);
            localStorage.setItem("DepName", result[0].DepName); //部门
            localStorage.setItem("UserCode", result[0].UserCode); //账号
            localStorage.setItem("UserName", result[0].UserName); //用户名
            localStorage.setItem("Dept", result[0].Dept); //部门编号
            const info = result[0];
            store.commit(RECEIVE_LOGININFO, {info}); 
            infoobj.id = 1;
            infoobj.content = '登录成功';  
            return infoobj;
        }
        else {
            infoobj.id = 0;
            infoobj.content = result[0].UserName;
            return infoobj;
        }
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