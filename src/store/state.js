export const state = {
    loginInfos: {},  //登录信息
    newInfo: [],  // 最新消息
    hpContent: [], //帮助文档文章内容(用于编辑更新文档的，仅一条)
    arDownload: [], //资料下载
    productList: [], //产品i清单列表
    screen: {         //屏幕大小
        width: 0,
        height: 0
    },
    tabsw: 0, //控制首页tab
    prDetail: [], //产品清单详情
    prClassify: [], //产品清单分类
    tabswpr: 0, //控制产品清单tab
    hpClassify: [], //帮助文档分类
    hpTitle: [], //帮助文档标题
    tabswhp: 0, //控制帮助文档tab
    isReadLogin: false, //阅读密钥（暂时不用）
    files: [],  //资料下载里的文件信息
    sq:-1,//搜索-分类索引
    scon:'',//搜索-关键字
    sdata:[],//搜索-数据
}