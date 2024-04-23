import React, { useEffect } from 'react'
import styles from  './Login.module.less'
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../services/user';
import { aesEncrypt } from '../utils/user-crypto';
import { removeUserId, removeUserName, setUserId, setUserName } from '../utils/user-info';

export default function Login() {
  const navigate = useNavigate()
  const onFinish = (values: any) => {
    let userInfoStr = JSON.stringify({username: values.mailBox, password: values.password});
    const encryptStr = aesEncrypt(userInfoStr);
    userLogin({
      data: encryptStr
    }).then((res: any) => {
      if(res) {
        message.info('登录成功')
        setUserId(res.id)
        setUserName(res.username)
        navigate('/home')
      } else {
        message.error('账号或密码错误')
      }
    })
  };
  
  const onFinishFailed = (errorInfo: any) => {
    // console.log('Failed:', errorInfo);
  };

  const handleRegisterHandle = () => {
    navigate('/register')
  }

  useEffect(() => {
    removeUserId();
    removeUserName();
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
          <div className={styles.logoWrap}>
            <img className={styles.imgWrap} src="./logo-line.png" alt="" />
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
              label="邮箱"
              name="mailBox"
              rules={[{ required: true, message: '请输入您的邮箱地址' },{ type: 'email', message: "请输入正确的邮箱" }]}
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
            <Form.Item style={{textAlign:'right'}}>
              <Button type="link" onClick={handleRegisterHandle}>
                注册账号
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
