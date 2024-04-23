import axios from './ajax'

// 冻结能量
export async function freezeEnger({userId, token, receiverAddress, resourceValue, duration}:any) {
  const url = '/api/open/freeze-order';
  let data:any = await axios.post(url, {
    _id: userId,
    token: token,
    resource: 'ENERGY',
    receiverAddress: receiverAddress,
    resourceValue: resourceValue,
    duration: duration
  })
  console.log('data', data)
  data = data || {};
  data.receiverAddress = receiverAddress;
  return data;
}


// 重置私钥
export async function resetApiKey(userId:any) {
  const url = '/api/open/reset-token'
  const data = await axios.post(url,{
    _id: userId
  })
  return data;
}

// 查询下单的参数
export async function getPayConfig(userId:any) {
  const url = '/api/open/payConfig'
  const data = await axios.post(url,{
    _id: userId
  })
  return data;
}