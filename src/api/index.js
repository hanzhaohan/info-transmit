import ajaxs from './ajax'

//上传图片
export const uploadImage = param => ajaxs.ajaxFile('/api/service/DOC_DataHandle.ashx', param)

//发布文章
export const publishArticle = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//保存文章
export const saveArticle = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//登录
export const loginConfirm = param => ajaxs.ajaxCommon('/api/service/GetData.ashx', param, 'POST')

//获取内容信息
export const receiveCont = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//删除文章
export const deleteAr = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//获取文章详情
export const receiveDetail = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//获取产品清单详情
export const receiveDetailPr = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//获取产品清单分类
export const receivePrClassify = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//获取帮助文档分类
export const receiveHpClassify = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//获取帮助文档标题
export const receiveHpTitle = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//阅读密钥
export const readLoginConfirm = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//获取文件信息
export const receiveFiles = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//保存文件夹
export const saveFolder = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//删除文件/文件夹
export const delectFile = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//合并文件
export const merge = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//搜索（最新消息/帮助文档/资料下载）
export const receiveSearch = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')

//获取上传图片到七牛的token
export const receiveToken = param => ajaxs.ajaxCommon('/api/service/DOC_DataHandle.ashx', param, 'POST')