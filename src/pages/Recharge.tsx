import React, { useEffect, useState } from 'react'
import styles from './Recharge.module.less'
import { LeftCircleOutlined, CopyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Input, Row, Space, message } from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux'
import { editUserDetail } from '../services/user'
import { loginReducer } from '../store/userReducer'
import { getPlatformConfigInfo } from '../services/platform'

export default function Recharge() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()
  const [apiRevenueAddress, setApiRevenueAddress] = useState(null)
  const { walletAddress } = useSelector( (state:any) => state.user)
  const handleGoBackClick = () => {
    navigate(-1)
  }
  
  useEffect(() => {
    getPlatformConfigInfo().then((data:any) => {
      console.log(data)
      setApiRevenueAddress(data.config.apiRevenueAddress)
    })
  }, [])
  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.header}>
          <LeftCircleOutlined style={{fontSize: '20px'}} onClick={handleGoBackClick}/>
          <span style={{marginLeft: '10px', fontSize: '15px', fontWeight: 'bolder'}}>充值</span>
        </div>
        <div className={styles.content}>
          {/* 充值模块 */}
          { walletAddress && 
            <div className={styles.moduleWrap}>
              <Space direction='vertical' size='middle' style={{width: '100%'}}>
              <span style={{fontSize:'20px', fontWeight:'bolder'}}>平台钱包地址</span>
                <Row >
                  <Col span={8}>
                    <CopyToClipboard text={apiRevenueAddress} onCopy={() => {
                        messageApi.open({
                          type: 'success',
                          content: '复制成功',
                        });
                      }}>
                      <div className={styles.addressContentWrap}>
                        <span>{apiRevenueAddress}</span>
                        <CopyOutlined />
                      </div>
                    </CopyToClipboard>
                  </Col>
                </Row>
                <Row >
                  <Col span={8}>
                    <div>1.请使用波场浏览器或手机钱包进行转账。</div>
                    <div>2.请核对钱包地址后再转账,若转账后没查到充值金额,可联系客服找回。</div>
                    <div style={{color: 'rgb(38, 161, 123)'}}>3.必须使用账号绑定的钱包地址转账充值才可以正常入账。</div>
                    <div style={{color: 'rgb(38, 161, 123)'}}>4.转账金额必须大于1TRX</div>
                  </Col>
                </Row>
              </Space>
            </div>
          }
        </div>
      </div>
    </>
  )
}
