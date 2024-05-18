import axios from './ajax';

// 获取记录
export async function getPointRecord(params: any) {
  const url = '/api/dashboard/user/getPointApplicationList';
  const {
    uuid,
    status,
    actionType,
    email,
    pageIdx = 1,
    pageCount = 10,
  } = params;
  const data = await axios.get(url, {
    params: {
      uuid,
      status,
      actionType,
      email,
      pageIdx,
      pageCount,
    },
  });
  return data;
}

// 主动调用接口获取用户充值记录
export async function getRechargeRecord(params: any) {
  const url = '/api/dashboard/user/getAccountTransactions';
  const {
    email,
    walletAddress,
    actionType,
    pageIdx = 1,
    pageCount = 10,
  } = params;
  const data = await axios.get(url, {
    params: { email, walletAddress, actionType, pageIdx, pageCount },
  });
  return data;
}
