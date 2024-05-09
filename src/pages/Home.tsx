import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Space,
  message,
  Form,
  Spin,
  List,
  Statistic,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  getUserDetail,
  editUserDetail,
  changePass,
  addApplyPoint,
} from '../services/user';
import { getPayConfig } from '../services/toolkit';
import { loginReducer } from '../store/userReducer';
import {
  getUserId,
  getUserName,
  setUserLoginOut,
  setUserToken,
} from '../utils/user-info';
import styles from './Home.module.less';
import NavTitle from '../components/NavTitle';

export default function Home() {
  const roleTypeList = {
    1: '普通用户',
    2: '节点用户',
    3: '服务商',
  };
  const dispatch = useDispatch();
  const [walletBindStatus, setWalletBindStatus] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [walletAddress, setWalletAddress] = useState<any>(undefined);
  const [isBindWalletAddressModalOpen, setisBindWalletAddressModalOpen] =
    useState(false);
  const [isChangePasswordModalOpen, setisChangePasswordModalOpen] =
    useState(false);
  const [isExChangePointsModalOpen, setisExChangePointsModalOpen] =
    useState(false);
  const [isPurchaseAccountModalOpen, setisPurchaseAccountModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [payConfig, setPayConfig] = useState<any>({});
  const [messageApi, contextHolder] = message.useMessage();
  const userName = getUserName();
  const nav = useNavigate();
  const handleBingClick = () => {
    setisBindWalletAddressModalOpen(true);
  };
  // 点击兑换按钮
  const handleWithDrawClick = () => {
    setisExChangePointsModalOpen(true);
  };
  // 处理修改密码
  const handleChangePasswordClick = () => {
    setisChangePasswordModalOpen(true);
  };
  // 修改密码点击确认
  const handleChangePasswordOk = () => {
    setisChangePasswordModalOpen(false);
  };
  // 修改密码点击取消
  const handleChangePasswordCancel = () => {
    setisChangePasswordModalOpen(false);
  };
  const onFinish = (values: any) => {
    // 更新密码
    changePass({
      userId: userName as string,
      password: values.newPassword,
    }).then((data) => {
      console.log(data);
      if (data) {
        messageApi.info('修改密码成功');
        setLoading(true);
        setisChangePasswordModalOpen(false);
        setTimeout(() => {
          setUserLoginOut();
        }, 3000);
      }
    });
  };
  const onFinishFailed = () => {};
  const handleBindWalletAddressOk = () => {
    if (walletAddress) {
      editUserDetail({
        userName: userName,
        walletAddress: walletAddress,
      }).then((data: any) => {
        if (data) {
          messageApi.success('绑定成功');
          setisBindWalletAddressModalOpen(false);
          updateUserDetail();
        } else {
          messageApi.error('钱包地址不正确，请输入正确的钱包地址');
        }
      });
    } else {
      message.error('请输入合法的钱包地址');
    }
  };
  const handleBindWalletAddressCancel = () => {
    setisBindWalletAddressModalOpen(false);
    setWalletAddress(userInfo.walletAddress);
  };
  // 点击兑换的确认按钮
  const handleExChangePointsModalOk = () => {
    setisExChangePointsModalOpen(false);
    addApplyPoint({
      uuid: getUserId(),
      actionType: '001',
      desc: '用户提现',
      amount: userInfo.credits,
    }).then((res: any) => {
      console.log('data', res);
      const { data, success } = res;
      if (success) {
        message.success('提交成功！');
      } else {
        message.success('申请失败，请联系管理员');
      }
      updateUserDetail();
    });
  };
  // 点击兑换的取消按钮
  const handleExChangePointsModalCancel = () => {
    setisExChangePointsModalOpen(false);
  };
  // 选购账户确认按钮
  const handlePurchaseAccountModalOk = () => {
    setisPurchaseAccountModalOpen(false);
  };
  // 选购账户取消按钮
  const handlePurchaseAccountModalCancel = () => {
    setisPurchaseAccountModalOpen(false);
  };
  const updateUserDetail = () => {
    getUserDetail(userName).then((res: any) => {
      // dispatch(loginReducer({ ...data }));
      const { success, data } = res;
      console.log('data', data);
      if (success) {
        setUserInfo(data);
      } else {
        message.error('获取用户信息失败');
      }
    });
  };

  const updatePayConfig = () => {
    getPayConfig(userName).then((data: any) => {
      console.log('-data', data);
      setPayConfig(data);
    });
  };
  useEffect(() => {
    updateUserDetail();
    // updatePayConfig();
  }, []);

  useEffect(() => {
    if (userInfo.walletAddress) {
      setWalletBindStatus(true);
    } else {
      setWalletBindStatus(false);
    }
    setWalletAddress(userInfo.walletAddress);
  }, [userInfo]);
  return (
    <>
      <NavTitle title='首页' />
      <Spin
        tip='即将跳转到登录页面,请重新登录!'
        spinning={loading}
        size='large'
      >
        <div className={styles.container}>
          {contextHolder}
          {/* 账户余额 */}
          <Row gutter={[15, 10]}>
            <Col span={24}>
              <Card title='用户信息'>
                <List itemLayout='horizontal'>
                  <List.Item
                    style={{ overflow: 'auto' }}
                    actions={[
                      <Button
                        disabled={userInfo.credits == 0}
                        onClick={handleWithDrawClick}
                      >
                        提现
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta title='账户积分:' />
                    {userInfo.credits + ' 积分'}
                  </List.Item>
                  <List.Item
                    style={{ overflow: 'auto' }}
                    actions={[
                      <Button
                        type='primary'
                        onClick={() => {
                          setisPurchaseAccountModalOpen(true);
                        }}
                      >
                        兑换普通用户
                      </Button>,
                      <Button
                        type='primary'
                        onClick={() => {
                          setisPurchaseAccountModalOpen(true);
                        }}
                      >
                        兑换节点
                      </Button>,
                      <Button
                        type='primary'
                        onClick={() => {
                          setisPurchaseAccountModalOpen(true);
                        }}
                      >
                        兑换服务商
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title='账户类型:'
                      description='账户类型可以通过积分来购买'
                    ></List.Item.Meta>
                    {userInfo.subscriptions && userInfo.subscriptions.type
                      ? userInfo.subscriptions.type.roleType
                      : '请选择你的需要的账户类型'}
                  </List.Item>
                  <List.Item
                    style={{ overflow: 'auto' }}
                    // actions={[
                    //   <Button type='link' onClick={handleChangePasswordClick}>
                    //     修改密码
                    //   </Button>,
                    // ]}
                  >
                    <List.Item.Meta
                      title='邮箱:'
                      description='支持账号密码登录，可找回账号'
                    ></List.Item.Meta>
                    {userInfo.email}
                  </List.Item>
                  <List.Item
                    style={{ overflow: 'auto' }}
                    // actions={[
                    //   <Button type='link' onClick={handleBingClick}>
                    //     {walletBindStatus === false ? '绑定钱包' : '编辑'}
                    //   </Button>,
                    // ]}
                  >
                    <List.Item.Meta
                      title='Tron钱包地址:'
                      description='绑定钱包地址，充值自动识别入账'
                    ></List.Item.Meta>
                    {userInfo.walletAddress}
                  </List.Item>
                </List>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
      <Modal
        title='绑定钱包地址'
        open={isBindWalletAddressModalOpen}
        onOk={handleBindWalletAddressOk}
        onCancel={handleBindWalletAddressCancel}
        okText='确认'
        cancelText='取消'
      >
        <Input
          value={walletAddress}
          allowClear={true}
          onChange={(e) => {
            let { value } = e.target;
            setWalletAddress(value);
          }}
          placeholder='请输入钱包地址'
        />
      </Modal>
      <Modal
        title='修改密码'
        open={isChangePasswordModalOpen}
        onOk={handleChangePasswordOk}
        onCancel={handleChangePasswordCancel}
        footer={null}
      >
        <Form
          name='basic'
          layout='vertical'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          size='large'
        >
          <Form.Item
            label='新密码'
            name='newPassword'
            rules={[{ required: true, message: '请输入您的新密码!' }]}
          >
            <Input.Password placeholder='请输入新密码' />
          </Form.Item>
          <Form.Item
            label='确认新密码'
            name='confrimNewPassword'
            rules={[
              { required: true, message: '请输入您的新密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password placeholder='请再次输入新密码' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' size='large' block>
              注册账号
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* 兑换积分 */}
      <Modal
        title='兑换积分'
        open={isExChangePointsModalOpen}
        onOk={handleExChangePointsModalOk}
        onCancel={handleExChangePointsModalCancel}
        okText='确认'
        cancelText='取消'
      >
        <p>兑换积分: {userInfo.credits}积分</p>
        <p>积分兑换的钱将稍后转入到钱包。</p>
        <p>有任何问题请联系客服！</p>
      </Modal>
      {/* 购买账户类型 */}
      <Modal
        title='选购账户'
        open={isPurchaseAccountModalOpen}
        onOk={handlePurchaseAccountModalOk}
        onCancel={handlePurchaseAccountModalCancel}
        okText='购买'
        cancelText='取消'
      >
        <p></p>
        <p>积分兑换的钱将稍后转入到钱包。</p>
      </Modal>
    </>
  );
}
