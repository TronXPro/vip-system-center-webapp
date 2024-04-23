import axios from './ajax'

// 获取租用记录
export async function getSaleRecord(params:any) {
  const url = '/api/order/lists';
  const data = await axios.post(url, {
    source: 1,
    page: 1,
    pageSize: 10,
    ...params
  })
  return data
}

// 获取充值记录
export  async function getRechargeRecord(params:any) {
  const url = '/api/open/recharge-records'
  const data = await axios.post(url, {
    page: 1,
    pageSize: 10,
    ...params
  })
  return data
}


// 查询冻结哈希
export async function getFreezeHashList (orderId: any) {
  const url = 'api/order/sub_lists'
  const data = await axios.post(url, {
    orderId: orderId,
    pageSize: 99999
  })
  return data;
}




