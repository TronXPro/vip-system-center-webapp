import axios from './ajax'

// 获取平台配置的信息
export async function getPlatformConfigInfo() {
  const url = '/api/config/info'
  const data = await axios.get(url)
  return data;
}
