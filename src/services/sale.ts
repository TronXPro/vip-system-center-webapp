import axios from './ajax';

// 获取记录
export async function getPointRecord(params: any) {
  const url = '/api/dashboard/user/getPointApplicationList';
  const { uuid, status, actionType, email } = params;
  const data = await axios.post(url, { uuid, status, actionType, email });
  return data;
}
