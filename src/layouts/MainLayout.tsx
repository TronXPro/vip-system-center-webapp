import react, { FC, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Avatar, Button, Drawer, Dropdown, Layout } from 'antd';
import { UserOutlined, LogoutOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styles from './MainLayout.module.less'
import SideMenu from '../components/SideMenu';
import { getUserId, getUserName, setUserLoginOut } from '../utils/user-info';
import useNavPage from '../hooks/useNavPage';
import { loginReducer } from '../store/userReducer';
import { setUserToken } from '../utils/user-info';
import { getUserDetail } from '../services/user';
import { useDispatch } from 'react-redux';
import useMediaQuery from '../hooks/useMediaQuery';
import NavTitle from '../components/NavTitle';

const { Header, Content } = Layout;

const MainLayout:FC = (props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 750px)");
  const userName = ''//getUserName();
  const userId = ''//getUserId();
  const handleLogOutClick = () => {
    setUserLoginOut()
  }
  const items =[
  {
    key: 2,
    label: (
      <div className={styles.menuItem}>
        <LogoutOutlined />
        <span className={styles.menuItemName} onClick={handleLogOutClick}>退出登录</span>
      </div>
    )
  }]
  const updateUserDetail = () => {
    getUserDetail(userId).then((data:any) => {
      dispatch(loginReducer({...data}))
      setUserToken(data.token)
    })
  }
  const onClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    // updateUserDetail();
  }, [])
  // 判断用户是否处于登录的状态
  // useNavPage()
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logoWrap}>
          <img src="./logo.png" alt="" />
          <span className={styles.titleName}>DiDiVip</span>
        </div>
        {!isMobile ? 
          <Dropdown
            trigger={['click']}
            menu={{
              items,
            }}
          >
            <div>
              <Avatar style={{cursor: 'pointer'}} size="large" icon={<UserOutlined />} />
              <span style={{color: '#fff'}}>{userName}</span>
            </div>
          </Dropdown> : <Button icon={<MenuUnfoldOutlined />} onClick={() => {setOpen(true)}}>
          </Button>
        }
      </Header>
      <Content className={styles.main}>
        { !isMobile && <SideMenu/>}
        <div style={{flex:1, overflow: 'hidden'}}>
          <Outlet />
        </div>
      </Content>
      <Drawer title="菜单" width='250' bodyStyle={{padding: 0}} onClose={onClose} open={open}>
        <SideMenu/>
      </Drawer>
    </Layout>
  )
}

export default MainLayout;