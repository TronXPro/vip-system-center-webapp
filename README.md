临时

生产环境接口临时域名：https://test-trade.checkcat450.me/tradebot

所有接口返回格式为：
{
 success: boolean,
 msg: string,
 data: any,
}

登录接口 /user/login
POST， 参数： accountName, password
返回： 返回格式中的 data 为 { token, accountName, uuid }

用户绑定钱包地址接口 /dashboard/user/bindAccountWalletAddress
POST， 参数： email, walletAddress
返回： 返回格式中的 data 不返回

用户更新钱包地址接口 /dashboard/user/updateAccountWalletAddress
POST， 参数： email, walletAddress
返回： 返回格式中的 data 不返回 
用户查看自己的充值记录接口 /dashboard/user/getAccountTransactions
POST，参数： email, walletAddress 
返回：返回格式中的 data 为
{
   txID,
   amount,
   senderAddress,
   receiverAddress,
   coinSymbol,
   coinDecimals,
   rawCoinSymbol,
   rawCoinDecimals,
   rawAmount,
   uuid,
   accountName,
   createDate, }
备注：这个接口用户必须要手动自己调用，记录才会产生，也就是说页面上要有一个按钮，让用户自己主动点