import React, { useEffect, useState } from 'react';
import styles from './WithdrawalRecord.module.less';
import { Table } from 'antd';
import NavTitle from '../components/NavTitle';
import {
  getUserEmail,
  getUserId,
  getUserWalletAddress,
} from '../utils/user-info';
import { getPointRecord, getRechargeRecord } from '../services/sale';
import moment from 'moment';

export default function WithdrawalRecord() {
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
  const tableColumns: any = [
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
      title: '提现哈希',
      dataIndex: 'withdrawHash',
      key: 'withdrawHash',
      width: 300,
    },
    {
      title: '提现地址',
      dataIndex: 'withdrawAddress',
      key: 'withdrawAddress',
      width: 300,
    },
    {
      title: '提现金额(USDT)',
      dataIndex: 'withdrawNum',
      key: 'withdrawNum',
      width: 200,
      render: (amount: number, record: any) => {
        const { coinDecimals } = record;
        return Number(amount) / Math.pow(10, Number(coinDecimals || 6));
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
  useEffect(() => {
    const email = getUserEmail();
    const uuid = getUserId();
    const walletAddress = getUserWalletAddress();
    setLoading(true);
    getPointRecord({
      uuid,
      email,
      walletAddress,
      actionType: '001',
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
      <NavTitle title='提现记录' />
      <div className={styles.containerWrap}>
        <div className={styles.container}>
          <Table
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
