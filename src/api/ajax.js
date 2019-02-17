import axios from "axios"
import Vue from 'vue'
import { Loading } from 'element-ui'

const API_Root = ''
const API_Root_DEV = '/api'
// axios.defaults.baseURL = (process.env.NODE_ENV === 'production' ? API_Root : API_Root_DEV)
axios.defaults.headers.Accept = 'application/json'
axios.defaults.timeout = 30000

// 添加请求拦截器
let loadinginstace;
axios.interceptors.request.use(function (config) {
    loadinginstace = Loading.service({ text: '正在加载中' });
    return config
  }, function (error) {
    loadinginstace.close();
    // Vue.toast(error, 'error');
    return Promise.reject(error)
  })
  
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    loadinginstace.close();
    return response
  }, function (error) {
    loadinginstace.close();
    // Vue.toast(error, 'error');
    return Promise.reject(error)
  })

let ajaxs = {
    ajaxCommon (url, data = {}, type = 'GET') {
        return new Promise(function (resolve, reject) {
            let promise;
            if (type === 'GET') {
                let str = this._paramJoin(data);
                url = str ? (url + '?' + str) : url;
                promise = axios.get(url);
            }
            else if (type === 'POST') {
                promise = axios.post(url, data);
            }
            promise.then(res => resolve(res.data)).catch(err => reject(err));
        })
    },
    ajaxFile (url, data = {}, type = 'POST') {
        return new Promise(function (resolve, reject) {
            let promise = axios.post(url, data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
            promise.then(res => resolve(res.data)).catch(err => reject(err));
        })
    },
    _paramJoin (data) {
        let arr = Object.keys(data);
        let str = '';
        arr.forEach(function (item) {
            str += item + '=' + data[item] + '&';
        })
        if(str !== ''){
            str = str.substr(0, str.length-1);
        }
        return str;
    }
}

export default ajaxs 