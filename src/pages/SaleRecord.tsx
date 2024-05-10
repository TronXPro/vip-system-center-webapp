import React, { useEffect, useState } from 'react';
import styles from './SaleRecord.module.less';
import { Table, Button, Modal, List, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getPointRecord } from '../services/sale';
import { useSelector } from 'react-redux';
import moment from 'moment';
import NavTitle from '../components/NavTitle';
import { getUserId, getUserEmail } from '../utils/user-info';

export default function SaleRecord() {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [freezeHashList, setfreezeHashList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const handleOk = () => {
    setIsModalOpen(false);
  };
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
  const handleTableChange = (pagination: any) => {
    console.log('pagination', pagination);
    setTableParams({
      ...tableParams,
      pagination: pagination,
    });
  };
  // 0 未完成 1 已完成 2部分完成 3撤销 4 退款 5 进行中 -1 预制单 -2 暂停
  const statusList = [
    {
      value: 'success',
      key: '兑换成功',
    },
    {
      value: 'fail',
      key: '兑换失败',
    },
    {
      value: 'pending',
      key: '审核',
    },
  ];
  const updatePointRecord = () => {
    const uuid = getUserId();
    const email = getUserEmail();
    setLoading(true);
    getPointRecord({ uuid, email }).then((res: any) => {
      setLoading(false);
      const { data, success } = res;
      if (success) {
        console.log('data', data);
        setTableData(data.list);
      } else {
        setTableData([]);
      }
    });
  };
  useEffect(() => {
    updatePointRecord();
  }, []);
  const tableColumns: any = [
    {
      title: '订单号',
      dataIndex: '_id',
      key: '_id',
      width: 170,
    },
    {
      title: '时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 200,
      render: (text: any) => {
        text = Number(text);
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '积分数量',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
    },
    {
      title: '记录类型',
      dataIndex: 'actionType',
      key: 'actionType',
      width: 100,
      render: (text: any) => {
        const actionTypeList: any = {
          '001': '积分提现',
          '002': '购买节点',
          '003': '购买服务商',
          '004': '充值U',
          '005': '分红',
        };
        return <div color='success'>{actionTypeList[text]}</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right',
      render: (text: any) => {
        let signItem = statusList.find((item) => item.value === text);
        return <div color='success'>{signItem?.key}</div>;
      },
    },
  ];
  return (
    <>
      {contextHolder}
      <NavTitle title='积分记录' />
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
          title='冻结哈希列表'
          width={800}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button type='primary' onClick={handleOk}>
              确定
            </Button>,
          ]}
        >
          <List
            bordered
            dataSource={freezeHashList}
            renderItem={(item) => (
              <List.Item>
                <span
                  className={styles.textBtnWrap}
                  onClick={() => {
                    window.open(
                      `https://tronscan.io/#/transaction/${item}`,
                      '_blank'
                    );
                  }}
                >
                  {item}
                </span>
                <CopyToClipboard
                  text={item}
                  onCopy={() => {
                    messageApi.open({
                      type: 'success',
                      content: '复制成功',
                    });
                  }}
                >
                  <Button size='small'>复制</Button>
                </CopyToClipboard>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </>
  );
}
