import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Input, Modal, Row, Space, message, Form, Spin, List, Statistic } from 'antd'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserDetail, editUserDetail, changePass } from '../services/user';
import { getPayConfig } from '../services/toolkit'
import { loginReducer } from '../store/userReducer';
import { getUserId, setUserLoginOut, setUserToken } from '../utils/user-info';
import styles from './Home.module.less'
import NavTitle from '../components/NavTitle';

export default function Home() {
  const dispatch = useDispatch();
  const [walletBindStatus, setWalletBindStatus] = useState(false)
  const [userInfo, setUserInfo] = useState<any>({})
  const [walletAddress, setWalletAddress] = useState<any>(undefined)
  const [isBindWalletAddressModalOpen, setisBindWalletAddressModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setisChangePasswordModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [payConfig, setPayConfig] = useState<any>({})
  const [messageApi, contextHolder] = message.useMessage();
  const userId = getUserId();
  const nav = useNavigate()
  const handleBingClick = () => {
    setisBindWalletAddressModalOpen(true)
  }
  const handleWithDrawClick = () => {
    window.open('https://t.me/jamestract', "_blank")
  }
  // 处理修改密码
  const handleChangePasswordClick = () => {
    setisChangePasswordModalOpen(true)
  }
  // 修改密码点击确认
  const handleChangePasswordOk = () => {
    setisChangePasswordModalOpen(false)
  }
  // 修改密码点击取消
  const handleChangePasswordCancel = () => {
    setisChangePasswordModalOpen(false)
  }
  const onFinish =(values: any) => {
    // 更新密码
    changePass({
      userId: userId as string, 
      password: values.newPassword
    }).then((data) => {
      console.log(data)
      if(data) {
        messageApi.info('修改密码成功')
        setLoading(true)
        setisChangePasswordModalOpen(false)
        setTimeout(() => {
          setUserLoginOut()
        }, 3000);
      }
    })
  }
  const onFinishFailed =() => {
  }
  const handleRecharge = () => {
    if(walletAddress) {
      nav('/recharge')
    } else {
      messageApi.info('请先绑定Tron钱包地址')
    }
  }
  const handleBindWalletAddressOk = () => {
    if(walletAddress) {
      editUserDetail({
        userId:userId,
        walletAddress: walletAddress
      }).then((data: any) => {
        if(data) {
          messageApi.success('绑定成功')
          setisBindWalletAddressModalOpen(false)
          updateUserDetail()
        } else {
          messageApi.error('钱包地址不正确，请输入正确的钱包地址')
        }
      })
    } else {
      message.error('请输入合法的钱包地址')
    }
  }
  const handleBindWalletAddressCancel = () => {
    setisBindWalletAddressModalOpen(false)
    setWalletAddress(userInfo.walletAddress)
  }
  const updateUserDetail = () => {
    getUserDetail(userId).then((data:any) => {
      dispatch(loginReducer({...data}))
      setUserInfo(data)
      setUserToken(data.token)
    })
  }

  const updatePayConfig = () => {
    getPayConfig(userId).then((data:any) => {
      console.log('-data', data)
      setPayConfig(data);
    })
  }
  useEffect(() => {
    updateUserDetail();
    updatePayConfig();
  }, []);

  useEffect(() => {
    if(userInfo.walletAddress) {
      setWalletBindStatus(true)
    } else {
      setWalletBindStatus(false)
    }
    setWalletAddress(userInfo.walletAddress)
  }, [userInfo]);
  return (
    <>
      <NavTitle title='首页' />
      <Spin tip="即将跳转到登录页面,请重新登录!" spinning={loading} size='large'>
        <div className={styles.container}>
          {contextHolder}
          {/* 账户余额 */}
          <Row gutter={[15,10]}>
            <Col span={24}>
              <Card title="账户余额">
                <List itemLayout="horizontal">
                  <List.Item
                    style={{ overflow:'auto' }}
                    actions={[<Button onClick={handleWithDrawClick}>提现</Button>,<Button type="primary" onClick={handleRecharge}>充值</Button>]}
                  >
                    <List.Item.Meta
                      title='账户余额:'
                    />
                    {userInfo.balance} TRX
                  </List.Item>
                  <List.Item
                    style={{ overflow:'auto' }}
                    actions={[<Button type="link" onClick={handleChangePasswordClick}>修改密码</Button>]}
                  >
                    <List.Item.Meta
                      title='邮箱:'
                      description='支持账号密码登录，可找回账号'
                    ></List.Item.Meta>
                    {userInfo.username}
                  </List.Item>
                  <List.Item 
                    style={{ overflow:'auto' }}
                    actions={[<Button type="link" onClick={handleBingClick}>{ walletBindStatus === false ? '绑定钱包' : '编辑'}</Button>]}
                  >
                    <List.Item.Meta
                      title='Tron钱包地址:'
                      description='绑定钱包地址，充值自动识别入账'
                    ></List.Item.Meta>
                    {userInfo.walletAddress}
                  </List.Item>
                </List>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="系统数据" style={{height: '100%'}}>
                {
                  payConfig?.priceConfig && (
                    <div>
                      <div style={{marginBottom: '15px'}}>
                        <Statistic title="平台能量数量" value={payConfig?.availableEnergy} />
                      </div>
                      <div className={styles.systemDatasWrap}>
                        <div style={{flex:'3 0 200px'}}>
                          <Statistic title="1小时价格" value={payConfig?.priceConfig['0.1'] + 'sun'} />
                        </div>
                        <div style={{flex:'3 0 200px'}}>
                          <Statistic title="1天价格" value={payConfig?.priceConfig['1'] + 'sun'} />
                        </div>
                        <div style={{flex:'3 0 200px'}}>
                          <Statistic title="3天价格" value={payConfig?.priceConfig['3'] + 'sun'} />
                        </div>
                        <div style={{flex:'3 0 200px'}}>
                          <Statistic title="10天价格" value={payConfig?.priceConfig['10'] + 'sun'} />
                        </div>
                      </div>
                    </div>
                  )
                }
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
      <Modal 
        title="绑定钱包地址" 
        open={isBindWalletAddressModalOpen}
        onOk={handleBindWalletAddressOk}
        onCancel={handleBindWalletAddressCancel}
        okText="确认"
        cancelText="取消"
      >
        <Input value={walletAddress} allowClear={true} onChange={(e) => {
          let { value } = e.target;
          setWalletAddress(value)
        }} placeholder='请输入钱包地址' />
      </Modal>
      <Modal 
        title="修改密码" 
        open={isChangePasswordModalOpen}
        onOk={handleChangePasswordOk}
        onCancel={handleChangePasswordCancel}
        footer={null}
      >
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          size="large"
        >
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入您的新密码!' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confrimNewPassword"
            rules={[
              { required: true, message: '请输入您的新密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              注册账号
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
