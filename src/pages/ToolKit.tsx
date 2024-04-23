import React, { useEffect, useState } from 'react'
import styles from './ToolKit.module.less'
import { Button, Input, Form, Radio, Spin, Space, message } from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TextArea from 'antd/es/input/TextArea'
import { freezeEnger, getPayConfig } from '../services/toolkit'
import { getUserId, getUserToken } from '../utils/user-info';
import NavTitle from '../components/NavTitle';
import { getPlatformConfigInfo } from '../services/platform'

const durationPriceMap:any = {
  '0.1': 'hourPrice',
  '1': 'energyDayPrice',
  '3': 'energyPrice',
  '10': 'energyTenPrice',
}

export default function ToolKit() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false)
  const [receiverAddressList, setReceiverAddressList] = useState([])
  const [addressSentResList, setAddressSentResList] = useState<any>([])
  const [failAddressArr, setFailAddressArr] = useState<any>([])
  const [payConfig, setPayConfig] = useState<any>({})
  const [platformConfigInfo, setPlatformConfigInfo] = useState<any>({})
  const [price, setPrice] = useState(0)
  const [costTrx, setCostTrx] = useState(0)
  const userId = getUserId()
  const token = getUserToken();
  const handleReceiverAddressClear = () => {
    form.setFieldValue('receiverAddress', '')
  }
  const handleAddressSentResClear = () => {
    setFailAddressArr([])
    form.setFieldValue('addressSentRes', '')
  }
  const onFinish = (values: any) => {
    setLoading(true)
    let sendProList:any = []
    values.receiverAddress.split('\n').map((item: any) => {
      let trimedStr = item.trim();
      if(trimedStr.length > 0) {
        sendProList.push(freezeEnger({
          userId: userId,
          token: token,
          receiverAddress: trimedStr,
          resourceValue: form.getFieldValue('resourceValue'),
          duration: form.getFieldValue('duration')
        }));
      }
    })
    setReceiverAddressList(sendProList);
    Promise.all(sendProList).then((res:any) => {
      setAddressSentResList([...res])
      setLoading(false)
    })
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // 获取平台配置信息
  const updatePlatformConfigInfo = () => {
    getPlatformConfigInfo().then((data:any) => {
      setPlatformConfigInfo({...data.config})
    })
  }
  // 得到单位价格
  const getPriceByConfig = (durationVal:any) => {
    let priceConfig = payConfig.priceConfig;
    let price =  priceConfig ? priceConfig[durationVal] : 0;
    return price;
  }
  // 更新价格
  const updatePrice = (durationVal:any) => {
    let price = getPriceByConfig(durationVal)
    setPrice(price)
  }
  // 计算需要花费的
  const updateCostTrx = () => {
    // 租用数量
    let resourceValue = Number(form.getFieldValue('resourceValue'))
    // 租用时间
    let duration = Number(form.getFieldValue('duration'));
    // 接收能量的地址个数
    let receiverAddress = form.getFieldValue('receiverAddress')
    // 单价
    let price = getPriceByConfig(duration)
    let receiverAddressLen:any = 0
    if(receiverAddress) {
      receiverAddressLen = receiverAddress.split('\n').filter((item:any) => (item.length > 0)).length;
    }
    let newcostTrx:any = getFrozenBalance(resourceValue, duration, price) / 1000000 * receiverAddressLen;
    newcostTrx = newcostTrx.toFixed(2)
    setCostTrx(newcostTrx)
  }

    /**
   * 获取需要冻结多少sun,和佣金
   * @param {*} resourceValue 资源数量
   * @param {*} duration 时长
   * @param {*} unitPrice 单价
   * @returns 需要冻结多少sun,和钱
   */
  const getFrozenBalance = (resourceValue:any, duration:any, unitPrice:any) => {
    // 计算需要支付的佣金
    let commission : any = 0;
    if (duration === 0.1) {
      commission = resourceValue * unitPrice * 1;
    } else {
      commission = resourceValue * unitPrice * duration + 1;
    }
    return commission;
  };

  useEffect(() => {
    let tempArr:any = []
    let sendResList = addressSentResList.map((item:any) => {
      let str = '';
      if(item?.orderId?.length) {
        str += item.receiverAddress + ': 成功'
      } else {
        str += item.receiverAddress + ': 失败，' + item.message
        tempArr.push(item.receiverAddress)
      }
      return str
    })
    setFailAddressArr([...tempArr])
    let value = sendResList.join('\n')
    form.setFieldValue('addressSentRes', value)
  }, [addressSentResList]);

  useEffect(() => {
    // 获取用户信息
    getPayConfig(userId).then(res => {
      setPayConfig(res);
    })
  }, [userId])

  useEffect(() => {
    let durationVal = form.getFieldValue('duration');
    updatePrice(durationVal)
  },[payConfig])

  useEffect(() => {
    // 获取平台信息
    updatePlatformConfigInfo()
    const plaConInfoInterv = setInterval(() => {
      updatePlatformConfigInfo()
    }, 10 * 1000);
    return () => {
      clearInterval(plaConInfoInterv)
    }
  }, [])


  return (
    <>
      {contextHolder}
      <NavTitle title='工具箱' />
      <div className={styles.container}>
        <Spin tip="正在冻结中，请不要关闭界面和刷新" spinning={loading} size="large">
          <h1>批量租能量</h1>
          <div className={styles.infoWrap}>
            <Space direction='vertical'>
              <div>平台能量: {payConfig?.availableEnergy} </div>
              <div>你的余额: {payConfig?.userInfo?.balance} TRX </div>
              <div>单笔最大下单数量:{payConfig?.limit?.max}</div>
            </Space>
          </div>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            style={{maxWidth: 600}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              duration: '0.1',
              resourceValue: 32000
            }}
            onValuesChange={() => {
              updateCostTrx();
              updatePrice(form.getFieldValue('duration'))
            }}
          >
            <Form.Item
              label="租用能量数"
              name="resourceValue"
              extra="下单数量不要超过单笔最大下单数量"
              rules={[
                {
                  validator: (_, value) =>{
                    // 判断是不是必填
                    if(!value) {
                      return Promise.reject(new Error('请输入数字'))
                    }
                    const res = Number(value)
                    // 判断是不是数字
                    if(isNaN(res)) {
                      return Promise.reject(new Error('请输入数字，不要带特殊符号、空格'))
                    }
                    // 判断数字的大小
                    if(res < 32000) {
                      return Promise.reject(new Error('32000 起租'))
                    }
                    if(res > 10000000) {
                      return Promise.reject(new Error('不要超过 10000000'))
                    }
                    return Promise.resolve();
                  }
                },
              ]}
            >
              <Input placeholder="每个地址租用的能量数，32000起租" />
            </Form.Item>
            <Form.Item label="租用时间" name="duration">
              <Radio.Group>
                <Radio.Button value="0.1">1小时</Radio.Button>
                <Radio.Button value="1">1天</Radio.Button>
                <Radio.Button value="3">3天</Radio.Button>
                <Radio.Button value="10">10天</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="能量单价" name="price">
              {price}sun
            </Form.Item>
            <Form.Item
              label="接收能量的地址（一行一个）"
              name="receiverAddress"
              rules={[
                {
                  required: true,
                  message: '请填入合规的地址'
                }
              ]}
            >
              <TextArea
                autoSize={{ minRows: 5, maxRows: 5 }}
                placeholder={`示例：
TUG8cpYXqZXdfTMnFVvvy9CNj6TYXVUSDY
TUG8cpYXqZXdfTMnFVvvy9CNj6TYXVUSDY
                `}
              />
            </Form.Item>
            <div className={styles.buttonWrap}>
              <Button type="primary" danger onClick={handleReceiverAddressClear}>清空</Button>
            </div>
            <Form.Item
              label="费用"
              name="costTrx"
            >
              <div className={styles.costTrxWrap}>{costTrx}trx</div>
              {
                costTrx > payConfig?.userInfo?.balance && (
                  <div className={styles.errorTips}>你的账户余额不够，请及时充值!</div>
                )
              }
            </Form.Item>
            <Form.Item
              label="已经发送的地址"
              name="addressSentRes"
            >
              <TextArea
                readOnly={true}
                autoSize={{ minRows: 5, maxRows: 5 }}
              />
            </Form.Item>
            <div className={styles.buttonWrap}>
              <Space>
                {
                  failAddressArr.length > 0 && (
                    <CopyToClipboard text={failAddressArr.join('\n')} onCopy={() => {
                      messageApi.open({
                        type: 'success',
                        content: '复制成功',
                      });
                    }}>
                      <Button type="primary">复制冻结失败的地址</Button>
                    </CopyToClipboard>
                  )
                }
                <Button type="primary" danger onClick={handleAddressSentResClear}>清空</Button>
              </Space>
            </div>
            <p>总共：{receiverAddressList.length} 个地址； 已经发送 {addressSentResList.length} 个请求； 成功：{addressSentResList.filter((item:any) => item.orderId).length} 个；失败：{addressSentResList.filter((item:any) => !item.orderId ).length} 个；</p>
            <Button disabled={costTrx > payConfig?.userInfo?.balance} type="primary" htmlType="submit" size='large' block>开始下单</Button>
          </Form>
        </Spin>
      </div>
    </>
  )
}
