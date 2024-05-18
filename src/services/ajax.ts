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
  (res) => {
    const resData = res.data || {};
    const status = res?.response?.status;
    if (status && Number(status) >= 400 && Number(status) < 500) {
      message.error({
        type: 'error',
        content: res?.response?.data?.msg || res?.message || '请求错误',
        style: {
          marginTop: '20vh',
        },
        duration: 2,
      });
    }
    return resData;
  }
);

export default instance;
