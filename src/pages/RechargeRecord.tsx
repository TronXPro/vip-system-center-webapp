import React, { useEffect, useState } from 'react';
import styles from './RechargeRecord.module.less';
import { Table } from 'antd';
import NavTitle from '../components/NavTitle';
import { getUserEmail, getUserWalletAddress } from '../utils/user-info';
import { getRechargeRecord } from '../services/sale';
import moment from 'moment';

export default function RechargeRecord() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const tableColumns: any = [
    {
      title: '时间',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (text: any) => {
        text = Number(text);
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '充值哈希',
      dataIndex: 'txID',
      key: 'txID',
    },
    {
      title: '充值地址',
      dataIndex: 'senderAddress',
      key: 'senderAddress',
    },
    {
      title: '充值金额(USDT)',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      fixed: 'right',
      render: (amount: number, record: any) => {
        const { coinDecimals } = record;
        return Number(amount) / Math.pow(10, Number(coinDecimals || 6));
      },
    },
  ];
  useEffect(() => {
    const email = getUserEmail();
    const walletAddress = getUserWalletAddress();
    setLoading(true);
    getRechargeRecord({
      email,
      walletAddress,
      pageIdx: tableParams.pagination.current,
      pageCount: tableParams.pagination.pageSize,
    }).then((res: any) => {
      setLoading(false);
      console.log(res);
      const { success, data } = res;
      if (success) {
        setTableData(data.list);
      }
    });
  }, [JSON.stringify(tableParams)]);

  return (
    <>
      <NavTitle title='充值记录' />
      <div className={styles.containerWrap}>
        <div className={styles.container}>
          <Table
            rowKey={'_id'}
            loading={loading}
            columns={tableColumns}
            dataSource={tableData}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
          />
        </div>
      </div>
    </>
  );
}
