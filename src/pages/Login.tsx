import React, { useEffect } from 'react'
import styles from  './Login.module.less'
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../services/user';
import { aesEncrypt } from '../utils/user-crypto';
import { removeUserId, removeUserName, setUserId, setUserName, setUserToken } from '../utils/user-info';

export default function Login() {
  const navigate = useNavigate()
  const onFinish = (values: any) => {
    // const encryptStr = aesEncrypt(userInfoStr);
    userLogin({accountName: values.userName, password: values.password}).then((res: any) => {
      console.log('res', res)
      const { data , success } = res; 
      if(success) {
        message.info('登录成功')
        const { accountName, token, uuid} = data
        setUserId(uuid)
        setUserName(accountName)
        setUserToken(token)
        navigate('/home')
      } else {
        message.error('账号或密码错误')
      }
    })
  };
  
  const onFinishFailed = (errorInfo: any) => {
    // console.log('Failed:', errorInfo);
  };


  useEffect(() => {
    removeUserId();
    removeUserName();
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
          <div className={styles.logoWrap}>
            <span className={styles.titleName}>无忧智能VIP平台</span>
          </div>
      </div>
      <div className={styles.loginFromWrap}>
        <div className={styles.content}>
          <div>
            <h1>登录</h1>
          </div>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="用户名"
              name="userName"
              rules={[{ required: true, message: '请输入您的用户名' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入您的密码!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  登录
                </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
