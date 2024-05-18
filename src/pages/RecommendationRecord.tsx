import React, { useEffect, useState } from 'react';
import styles from './RecommendationRecord.module.less';
import { Table } from 'antd';
import NavTitle from '../components/NavTitle';
import {
  getUserEmail,
  getUserId,
  getUserWalletAddress,
} from '../utils/user-info';
import { getPointRecord, getRechargeRecord } from '../services/sale';
import moment from 'moment';
import { getSubAccounts } from '../services/user';

export default function RecommendationRecord() {
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
      width: 200,
      render: (text: any) => {
        text = Number(text);
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '用户名',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 300,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 300,
    },
    {
      title: '推荐状态',
      dataIndex: 'isValid',
      key: 'isValid',
      width: 100,
      fixed: 'right',
      render: (text: any) => {
        return text ? '成功' : '处理中';
      },
    },
  ];
  useEffect(() => {
    const email = getUserEmail();
    setLoading(true);
    getSubAccounts({
      email,
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
      <NavTitle title='推荐记录' />
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
