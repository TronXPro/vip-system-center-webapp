import axios from './ajax';

// 获取API用户的详情
export async function getUserDetail(userName: any) {
  const url = '/api/dashboard/user/getAccountInfo';
  const data = await axios.get(url, {
    params: {
      accountName: userName,
    },
  });
  if (data == null) return {};
  return data;
}

// 编辑用户
export async function editUserDetail(params: any) {
  const url = '/api/open/edit-user-info';
  const data = await axios.post(url, {
    _id: params.userId,
    ...params,
  });
  return data;
}

// 注册用户
export async function registerUser(params: {}) {
  const url = '/api/open/register';
  const data = await axios.post(url, {
    ...params,
  });
  return data;
}

// 用户登录
export async function userLogin(params: {}) {
  const url = '/api/user/login';
  const data = await axios.post(url, {
    ...params,
  });
  return data;
}

// 修改密码
export async function changePass(params: { userId: string; password: string }) {
  const url = 'api/open/change-password ';
  const data = await axios.post(url, {
    _id: params.userId,
    password: params.password,
  });
  return data;
}

// 提现积分
export async function addApplyPoint(params: any) {
  const url = 'api/dashboard/user/applyPoint';
  const data = await axios.post(url, { ...params });
  return data;
}

// 获取配置
export async function getPaymentConfig() {
  const url = '/api/dashboard/user/getPaymentConfig';
  const data = await axios.get(url);
  return data;
}

// 用积分兑换身份
export async function updateSubscriptions(params: any) {
  const url = 'api/dashboard/user/updateSubscriptions';
  const data = await axios.post(url, { ...params });
  return data;
}
