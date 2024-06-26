import React, { useEffect, useState } from 'react';
import {
  UserSwitchOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  FileWordOutlined,
  ProfileOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import styles from './SideMenu.module.less';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SideMenu() {
  const [current, setCurrent] = useState('');
  const nav = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname]);
  const onClick = (e: any) => {
    setCurrent(e.key);
    nav(e.key);
  };
  const items = [
    {
      label: '首页',
      key: '/home',
      icon: <HomeOutlined />,
    },
    {
      label: '积分记录',
      key: '/sale-record',
      icon: <UnorderedListOutlined />,
    },
    {
      label: '充值记录',
      key: '/recharge-record',
      icon: <ProfileOutlined />,
    },
    {
      label: '提现记录',
      key: '/withdrawal-record',
      icon: <MoneyCollectOutlined />,
    },
    {
      label: '推荐记录',
      key: '/recommendation-record',
      icon: <UserSwitchOutlined />,
    },
    {
      label: '常见问题',
      key: '/help',
      icon: <FileWordOutlined />,
    },
  ];
  return (
    <div className={styles.container}>
      <Menu
        style={{
          width: 256,
        }}
        onClick={onClick}
        selectedKeys={[current]}
        mode='inline'
        items={items}
      />
    </div>
  );
}
