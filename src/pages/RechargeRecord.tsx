import React, { useEffect, useState } from 'react';
import styles from './RechargeRecord.module.less';
import { Table } from 'antd';
// import { useSelector } from 'react-redux'
import { scalerSunToTrx } from '../utils/tool';
import NavTitle from '../components/NavTitle';
import { getUserName } from '../utils/user-info';

export default function RechargeRecord() {
  // const { username } = useSelector( (state:any) => state.user)
  const username = getUserName();
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
      title: '充值哈希',
      dataIndex: 'hash',
      key: 'hash',
    },
    {
      title: '充值地址',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: '充值金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      fixed: 'right',
      render: (text: any) => {
        return scalerSunToTrx(text) + 'TRX';
      },
    },
  ];
  useEffect(() => {
    // setLoading(true)
  }, [JSON.stringify(tableParams)]);
  return (
    <>
      <NavTitle title='充值记录' />
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
