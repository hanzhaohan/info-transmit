import {
    RECEIVE_LOGININFO,
    SAVE_LOGININFO,
    EXIT,
    RECEIVE_NEWINFO,
    RECEIVE_HELPARTICLE,
    RECEIVE_ARDOWNLOAD,
    RECEIVE_PRODUCTLIST,
    SCREEN_CHANGE,
    TAB_SWITCH,
    RECEIVE_DETAIL_PRODUCTLIST,
    RECEIVE_PRODUCTLIST_CLASSIFY,
    TAB_SWITCH_PR,
    RECEIVE_HELP_CLASSIFY,
    RECEIVE_HELP_TITLE,
    TAB_SWITCH_HP,
    RECEIVE_READLOGININFO,
    RECEIVE_FILES,
    RECEIVE_SEARCH_Q,
    RECEIVE_SEARCH_CON,
    RECEIVE_SEARCH_DATA,
} from './mutation-types'

export const mutations = {
    [RECEIVE_LOGININFO](state, { info }) {
        state.loginInfos = info;
    },
    [SAVE_LOGININFO](state, param) {
        state.loginInfos = param;
    },
    [EXIT](state) {
        state.loginInfos = {};
    },
    [RECEIVE_NEWINFO](state, { result }) {
        state.newInfo = result;
    },
    [RECEIVE_HELPARTICLE](state, { result }) {
        state.hpContent = result;
    },
    [RECEIVE_ARDOWNLOAD](state, { result }) {
        state.arDownload = result;
    },
    [RECEIVE_PRODUCTLIST](state, { result }) {
        state.productList = result;
    },
    [SCREEN_CHANGE](state, data) {
        state.screen = data;
    },
    [TAB_SWITCH](state, data) {
        state.tabsw = data;
    },
    [RECEIVE_DETAIL_PRODUCTLIST](state, data) {
        state.prDetail = data;
    },
    [RECEIVE_PRODUCTLIST_CLASSIFY](state, data) {
        state.prClassify = data;
    },
    [TAB_SWITCH_PR](state, data) {
        state.tabswpr = data;
    },
    [RECEIVE_HELP_CLASSIFY](state, data) {
        state.hpClassify = data;
    },
    [RECEIVE_HELP_TITLE](state, data) {
        state.hpTitle = data;
    },
    [TAB_SWITCH_HP](state, data) {
        state.tabswhp = data;
    },
    [RECEIVE_READLOGININFO](state, data) {
        state.isReadLogin = data;
    },
    [RECEIVE_FILES](state, data) {
        state.files = data;
    },
    [RECEIVE_SEARCH_Q](state, data) {
        state.sq = data;
    },
    [RECEIVE_SEARCH_CON](state, data) {
        state.scon = data;
    },
    [RECEIVE_SEARCH_DATA](state, data) {
        state.sdata = data;
    },
} 