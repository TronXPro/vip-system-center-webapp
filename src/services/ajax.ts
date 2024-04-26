import { message } from 'antd';
import axios from 'axios'
import { getUserToken } from '../utils/user-info';
const apiUrl = process.env.REACT_APP_API_URL;
console.log('apiUrl', apiUrl)

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10 * 10000
})

// 请求拦截
instance.interceptors.request.use(
  config => {
    config.headers['didi_token'] = getUserToken();
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截
instance.interceptors.response.use(res => {
  const resData = (res.data || {});
  const reqUrl = (res.config.url || null);
  const { status, data, message: messageContent } = resData;
  return resData as any
}, res => {
  const resData = (res.data || {});
  return resData
})

export default instance;