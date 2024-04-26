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
  console.log('----', res)
  
  const resData = (res.data || {});
  const reqUrl = (res.config.url || null);
  const { status, data, message: messageContent } = resData;
  // if(status !== 200) {
  //   // 错误提示
  //   if(message) {
  //     message.error(messageContent);
  //   }
  // }
  return resData as any
})

export default instance;