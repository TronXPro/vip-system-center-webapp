import axios from './ajax';

// 获取租用记录
export async function getPointRecord(params: any) {
  const url = '/api/dashboard/user/getPointApplicationList';
  const { uuid, status } = params;
  const data = await axios.post(url, { uuid, status });
  return data;
}
