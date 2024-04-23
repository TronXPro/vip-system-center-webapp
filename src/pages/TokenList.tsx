import React, { useEffect, useState } from 'react'
import styles from './TokenList.module.less'
import { Button, Card, Col, Input, Modal, Row, Space, message, List } from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { getUserId } from '../utils/user-info';
import { resetApiKey } from '../services/toolkit';
import { getUserDetail } from '../services/user';
import { loginReducer } from '../store/userReducer';
import NavTitle from '../components/NavTitle';

export default function TokenList() {
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keyList, setKeyList] = useState<Array<any>>([])
  const [keyName, setKeyName] = useState(undefined)
  const userID = getUserId();
  const { token } = useSelector( (state:any) => state.user)
  const [messageApi, contextHolder] = message.useMessage();
  const handleDeleteClick = (curItem: any) => {
    let index = keyList.findIndex(item => {
      return item.keyName === curItem.keyName && item.apiKey === curItem.apiKey;
    })
    keyList.splice(index, 1)
    setKeyList([...keyList])
  }
  const handleEditClick = () => {
    console.log('handleEditClick')
  }
  const handleCreateClick = () => {
    setIsCreateModalOpen(true)
  }
  const handleCreateModalOk = () => {
    setIsCreateModalOpen(false)
    if(keyName) {
      keyList.push({
        keyName: keyName,
        apiKey: '204f082a-e3bf-4e03-a574-66dfa7462394',
        rentToday: 0,
        rentAll: 0,
      })
      setKeyList([...keyList])
      setKeyName(undefined)
    }
  }
  const handleCreateModalCancel = () => {
    setIsCreateModalOpen(false)
  }
  const handleResetClick =() => {
    resetApiKey(userID).then((data) => {
      if(data) {
        messageApi.open({
          type: 'success',
          content: '重置成功',
        });
        getUserDetail(userID).then((data:any) => {
          dispatch(loginReducer({...data}))
        })
      }
    })
  }
  useEffect(() => {
    setKeyList([{
      keyName: 'API私钥',
      apiKey: token,
      rentToday: 0,
      rentAll: 0,
    }])
  }, [token])
  return (
    <>
      {contextHolder}
      <NavTitle title='API私钥' />
      <div className={styles.container}>
        {/* <div className={styles.dashBoard}>
          <div>API密钥 <span>({keyList.length}/3)</span></div>
          <Button type='primary' onClick={handleCreateClick} disabled={keyList.length >= 3}>创建API密钥</Button>
        </div> */}
        {
          keyList.map(item => {
            return (
              <div className={styles.ApiKeyListWrap}>
                <Card style={{marginBottom: '15px'}} title={item.keyName} extra={
                  <Space>
                    {/* <Button type='primary' onClick={handleEditClick}>编辑</Button> */}
                    {/* <Button type='primary' danger onClick={() => {
                      handleDeleteClick(item)
                    }}>删除</Button> */}
                  </Space>
                }>
                    <List itemLayout="horizontal" size="large">
                      <List.Item
                        style={{ overflow:'auto' }}
                        actions={[<CopyToClipboard text={item.apiKey} onCopy={() => {
                          messageApi.open({
                            type: 'success',
                            content: '复制成功',
                          });
                        }}>
                          <Button type='link' block>复制</Button>
                        </CopyToClipboard>]}
                      >
                        <List.Item.Meta
                          title='TOKEN:'
                          description="用户认证信息"
                        ></List.Item.Meta>
                          {item.apiKey}
                      </List.Item>
                      <List.Item
                        style={{ overflow:'auto' }}
                        actions={[<CopyToClipboard text={userID} onCopy={() => {
                          messageApi.open({
                            type: 'success',
                            content: '复制成功',
                          });
                        }}>
                          <Button type='link' block>复制</Button>
                        </CopyToClipboard>]}
                      >
                        <List.Item.Meta
                          title='id(用户认证ID):'
                          description="用户认证信息"
                        ></List.Item.Meta>
                          {userID}
                      </List.Item>
                    </List>
                    {/* <div>
                      <span>今日租用:</span>
                      <span>{item.rentToday} 能量 / 0 TRX</span>
                    </div>
                    <div>
                      <span>租用总量:</span>
                      <span>{item.rentAll} 能量 / 0 TRX</span>
                    </div> */}
                </Card>
              </div>
            )
          })
        }
      </div>
      <Modal 
        title="请输入Key的名称"
        open={isCreateModalOpen}
        onOk={handleCreateModalOk}
        onCancel={handleCreateModalCancel}
        okText="确认"
        cancelText="取消"
      >
        <div>
            <Input placeholder="请输入Key的名称" value={keyName} onChange={(e) => {
              let { value } = e.target;
              setKeyName(value as any)
            }} />
        </div>
      </Modal>
    </>
  )
}
