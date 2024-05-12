import { message } from 'antd';
import axios from 'axios';
import { getUserToken } from '../utils/user-info';
const apiUrl = process.env.REACT_APP_API_URL;
const isProduction = process.env.NODE_ENV === 'production';
console.log('apiUrl', apiUrl);
console.log('isProduction', isProduction);

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10 * 10000,
});

// 请求拦截
instance.interceptors.request.use(
  (config) => {
    const token = getUserToken();
    config.headers['authorization'] = `Bearer ${token}`;
    // 如果是 isProduction，就将接口中的 /api 去掉
    if (isProduction) {
      config.url = config.url?.replace('/api', '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截
instance.interceptors.response.use(
  (res) => {
    const resData = res.data || {};
    const reqUrl = res.config.url || null;
    const { status, data, message: messageContent } = resData;
    return resData as any;
  },
  (error) => {
    const content = error?.response?.data?.msg || error?.message || '请求错误';
    message.error(content);
    return error;
  }
);

export default instance;
