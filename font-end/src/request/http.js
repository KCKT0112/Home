/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import QS from 'qs';
import store from '../store/index';
import snackbar from '../components/Snackbar/int';
import router from '../router';

let requestor = axios.create();

requestor.defaults.baseURL = process.env.VUE_APP_ApiUrl + "/api";


// 请求超时时间
requestor.defaults.timeout = 10000;

// post请求头
requestor.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
requestor.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8';

// 请求拦截器
requestor.interceptors.request.use(
    config => {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = "Bearer " + localStorage.getItem('token');
        (config.headers.Authorization = token);
        return config;
    },
    error => {
        return Promise.error(error);
    });

// 响应拦截器
requestor.interceptors.response.use(
    response => {
        if (response.data.code === 'offline') {
            this.$store.commit('UPDATE_LOADING', false);
            this.$store.commit('UPDATE_OfflineShow', true);
        } else {
            if (response.status === 'canceled') {
                snackbar.error('网络请求超时');
            } else
                if (response.status === 200) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(response);
                }
        }
    },
    // 服务器状态码不是200的情况 
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录    
                // 未登录则跳转登录页面，并携带当前页面的路径    
                // 在登录成功后返回当前页面，这一步需要在登录页操作。    
                case 401:
                    snackbar.error('登入状态出错，请重新登入');
                    if (localStorage.getItem('token')) {
                        router.push({ path: '/Login' });
                        localStorage.removeItem('token');
                        store.commit('pushtoken', '');
                    }
                    router.push({ path: '/Login' });
                    break;
                // 403 token过期    
                // 登录过期对用户进行提示    
                // 清除本地token和清空vuex中token对象    
                // 跳转登录页面    
                case 403:
                    snackbar.error('登入状态过期');
                    // 清除token     
                    localStorage.removeItem('token');
                    store.commit('pushtoken', '');
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        this.$router.replace({
                            path: '/Login',
                            query: {
                                redirect: this.$router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;
                // 404请求不存在    
                case 404:
                    snackbar.error('网络请求不存在');
                    break;
                // 其他错误，直接抛出错误提示    
                default:
                    snackbar.error(error.response.data.data.message);
            }
            return Promise.reject(error.response);
        }
    }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        requestor.get(url, {
            params: params
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        requestor.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}