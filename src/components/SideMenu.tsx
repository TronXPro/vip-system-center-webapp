import React, {useEffect, useState} from 'react'
import { ApiOutlined, HomeOutlined, UnorderedListOutlined, FileWordOutlined, ProfileOutlined, ToolOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import styles from './SideMenu.module.less'
import { useLocation, useNavigate } from 'react-router-dom';

export default function SideMenu() {
  const [current, setCurrent] = useState('');
  const nav = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setCurrent(location.pathname)
  }, [location.pathname])
  const onClick = (e:any) => {
    setCurrent(e.key)
    nav(e.key)
  }
  const items = [
    {
      label: '首页',
      key: '/home',
      icon: <HomeOutlined />,
    },
    {
      label: '租用记录',
      key: '/sale-record',
      icon: <UnorderedListOutlined />,
    },
    {
      label: '充值记录',
      key: '/recharge-record',
      icon: <ProfileOutlined />,
    },
    {
      label: 'API密钥',
      key: '/token-list',
      icon: <ApiOutlined />,
    },
    {
      label: '工具箱',
      key: '/toolkit',
      icon: <ToolOutlined />,
    },
    {
      label: '使用帮助',
      key: '/help',
      icon: <FileWordOutlined />,
    }
  ]
  return (
    <div className={styles.container}>
      <Menu style={{
        width: 256,
      }} onClick={onClick} selectedKeys={[current]} mode="inline" items={items} />
    </div>
  )
}
