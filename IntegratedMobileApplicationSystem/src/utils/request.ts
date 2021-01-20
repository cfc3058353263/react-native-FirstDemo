/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-28 16:20:43
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-13 17:11:01
 */
import promise from 'es6-promise'
import axios from "axios";
import qs from 'qs';
import Constant from "./constant";
import { Alert, ToastAndroid } from 'react-native';
import NavigationService from './NavigationService';
import StorageData from './globalStorage'

promise.polyfill();
const cancelToken = axios.CancelToken;  //阻止请求
const pendding = []  //把当前请求的状态都存到一个数组里

// 请求拦截
axios.interceptors.request.use(config => {
    config.cancelToken = new cancelToken((c) => {
        pendding.push({ fun: c, url: config.url })
    })
    return Promise.resolve(config);
}), (err) => {
    return Promise.reject(err)
}

// 响应拦截
axios.interceptors.response.use((res) => {
    return Promise.resolve(res);
}, (err) => {
    if (err.response) {
        switch (err.response.status) {
            case 401:
                for (let i in pendding) {
                    pendding[i].fun(); //执行取消操作
                    pendding.splice(+i, 1); //把这条记录从数组中移除
                }
                StorageData.clearAll()
                NavigationService.navigate('login')
                break;
            case 500:
                for (let i in pendding) {
                    pendding[i].fun(); //执行取消操作
                    pendding.splice(+i, 1); //把这条记录从数组中移除
                }
                Alert.alert(null, "服务器连接失败", [{ text: '确定', onPress: () => null }])
                break;
        }
    }
    return Promise.reject(err);
});
export default class Http {
    host: string;
    port: number;
    token: string;
    constructor() {
        this.port = Constant.port;
        this.host = Constant.host;
        this.token = null;
    }
    setToken(token: string) {
        this.token = token;
        return this;
    }
    setPort(port: number) {
        this.port = port;
        return this;
    }
    setHost(host: string) {
        this.host = host;
        return this;
    }
    getHost() {
        return this.host;
    }
    doPost(url: string, headers: any, data: any, timeout: number): any {
        if (!headers) {
            headers = {
                "Content-Type": "application/json;charset=UTF-8"
            }

        };
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + `${this.token}`;
        }
        return axios({
            method: "post",
            url: "http://" + this.host + ":" + this.port + "/" + url,
            headers: headers,
            data: data,
            timeout: timeout || 15000
        })
    }
    doPostURLEncode(url: string, headers: any, data: any, timeout: number): any {
        if (!headers) {
            headers = {
                "Content-Type": "application/json;charset=UTF-8"
            }

        };
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + `${this.token}`;
        }
        return axios({
            method: "post",
            url: "http://" + this.host + ":" + this.port + "/" + url,
            headers: headers,
            data: qs.stringify(data),
            timeout: timeout || 15000,
        })
    }
    doGet(url: string, headers: any, data: any, timeout: number): any {
        if (!headers) {
            headers = {
                "Content-Type": "application/json; charset=UTF-8"
            }
        };
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + `${this.token}`;
        }
        return axios({
            method: "get",
            url: "http://" + this.host + ":" + this.port + "/" + url,
            headers: headers,
            params: data,
            timeout: timeout || 15000
        })
    }
    doPostform(url: string, headers: any, data: any, timeout: number): any {
        if (!headers) {
            headers = {
                "Content-Type": "application/json;charset=UTF-8"
            }

        };
        if (this.token) {
            headers['Authorization'] = this.token;
        }
        return axios({
            method: "post",
            url: "http://" + this.host + ":" + this.port + "/" + url + "?" + data,
            headers: headers,
            timeout: timeout || 15000
        })
    }
    doGetform(url: string, headers: any, data: any, timeout: number): any {
        if (!headers) {
            headers = {
                "Content-Type": "application/json; charset=UTF-8"
            }
        };
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + `${this.token}`;
        }
        return axios({
            method: "get",
            url: "http://" + this.host + ":" + this.port + "/" + url + "?" + data,
            headers: headers,
            timeout: timeout || 15000
        })
    }
}
