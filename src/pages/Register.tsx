import React, { useState } from 'react'
import styles from  './Register.module.less'
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/user';
import { CheckCircleOutlined } from '@ant-design/icons'

export default function Register() {
  const navigate = useNavigate()
  const [registerStatus, setRegisterStatus] = useState(false)
  const onFinish = (values: any) => {
    console.log('Success:', values);
    registerUser({
      username: values.mailBox,
      password: values.password
    }).then((res:any) => {
      console.log(res)
      if(res) {
        setRegisterStatus(res)
      } else {
        setRegisterStatus(false)

      }
    })
  };
  
  const onFinishFailed = (errorInfo: any) => {
    // console.log('Failed:', errorInfo);
  };

  const handleRegisterHandle = () => {
    navigate('/login')
  }

  const handleGotoLoginClick = () => {
    navigate('/login')
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
          <div className={styles.logoWrap}>
            <img className={styles.imgWrap} src="./logo-line.png" alt="" />
            <span className={styles.titleName}>DiDiAPI平台</span>
          </div>
      </div>
      <div className={styles.registerFromWrap}>
        {
          registerStatus === false ? (
          <div className={styles.content}>
            <div>
              <h1>注册账号</h1>
            </div>
            <Form
              name="basic"
              initialValues={{ remember: false }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                label="邮箱"
                name="mailBox"
                rules={[{ required: true, message: '请输入您的邮箱地址' },{type: "email", message: "请输入正确的邮箱"}]}
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
              <Form.Item
                label="确认密码"
                name="confirmPassword"
                rules={[
                  { required: true, message: '请确认您的密码!'},
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致！'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  注册账号
                </Button>
              </Form.Item>
              <Form.Item style={{textAlign:'right'}}>
                <Button type="link" onClick={handleRegisterHandle}>
                  已有账号，去登录
                </Button>
              </Form.Item>
            </Form>
          </div>
          ) : (
            <div className={styles.content}>
              <div className={styles.successTips}>
                <CheckCircleOutlined />
                <div className={styles.tipsContent}>注册成功！</div>
              </div>
              <Button type="primary" size="large" block onClick={handleGotoLoginClick}>
                去登录
              </Button>
            </div>
          )
        }
      </div>
    </div>
  )
}
