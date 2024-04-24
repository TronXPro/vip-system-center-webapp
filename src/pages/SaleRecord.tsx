import React, { useEffect, useState } from 'react'
import styles from './SaleRecord.module.less'
import { Table, Tag, Button, Modal, List, message } from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { getFreezeHashList, getSaleRecord } from '../services/sale'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { scalerSunToTrx, translateRentTime } from '../utils/tool'
import NavTitle from '../components/NavTitle';

export default function SaleRecord() {
  const { username } = useSelector( (state:any) => state.user)
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [freezeHashList, setfreezeHashList] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const handleOk = () => {
    setIsModalOpen(false);
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
      total: 0,
    },
  });
  const handleTableChange = (pagination:any)=> {
    console.log('pagination', pagination)
    setTableParams({
      ...tableParams,
      pagination: pagination
    })
  }
  // 0 未完成 1 已完成 2部分完成 3撤销 4 退款 5 进行中 -1 预制单 -2 暂停
  const statusList = [{
    value: 0,
    key: '未完成'
  },{
    value: 1,
    key: '已完成'
  },{
    value: 2,
    key: '部分完成'
  },{
    value: 3,
    key: '撤销'
  },{
    value: 4,
    key: '退款'
  },{
    value: 5,
    key: '进行中'
  }]
  useEffect(() => {
    // setLoading(true)
    
  }, [JSON.stringify(tableParams)])
  const tableColumns:any = [
    {
      title: '订单号',
      dataIndex: '_id',
      key: '_id',
      width: 170
    },
    {
      title: '推荐人的用户名',
      dataIndex: '_id',
      key: '_id',
      width: 170
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (text:any) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '积分数量',
      dataIndex: 'commission',
      key: 'commission',
      width: 100,
      render: (text:any) => {
        return scalerSunToTrx(text) + 'TRX'
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right',
      render: (text:any) => {
        let signItem = statusList.find(item => item.value === text)
        return  <Tag color="success">{signItem?.key}</Tag>
      },
    }
  ]
  return (
    <>
      {contextHolder}
      <NavTitle title='租用记录' />
      <div className={styles.container}>
        <Table
          loading={loading}
          columns={tableColumns}
          dataSource={tableData}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          scroll={{ x: 1600 }}
        />
        <Modal
          title="冻结哈希列表"
          width={800}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={
            [
              <Button type='primary' onClick={handleOk}>
                确定
              </Button>
            ]
          }
        >
          <List
            bordered
            dataSource={freezeHashList}
            renderItem={(item) => (
              <List.Item>
                <span className={styles.textBtnWrap} onClick={() => {
                  window.open(`https://tronscan.io/#/transaction/${item}`, '_blank')
                }}>{item}</span>
                <CopyToClipboard text={item} onCopy={() => {
                  messageApi.open({
                    type: 'success',
                    content: '复制成功',
                  });
                }}>
                  <Button size="small">复制</Button>
                </CopyToClipboard>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </>
  )
}
