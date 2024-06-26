import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  message,
  Form,
  Spin,
  List,
  Radio,
  Space,
  Tag,
  InputNumber,
} from 'antd';
import { useDispatch } from 'react-redux';
import QRCode from 'qrcode';
import {
  getUserDetail,
  editUserDetail,
  changePass,
  addApplyPoint,
  getPaymentConfig,
  updateSubscriptions,
} from '../services/user';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import { getUserId, getUserName, setUserLoginOut } from '../utils/user-info';
import styles from './Home.module.less';
import NavTitle from '../components/NavTitle';

export default function Home() {
  const roleTypeList: any = {
    [-999]: {
      color: 'default',
      text: '普通用户',
    },
    1: {
      color: '#108ee9',
      text: '会员',
    },
    2: {
      color: '#87d068',
      text: '节点用户',
    },
    3: {
      color: '#f50',
      text: '服务商',
    },
  };
  const qrCodeRef = useRef(null);
  const dispatch = useDispatch();
  const [walletBindStatus, setWalletBindStatus] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [link, setLink] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const [userCredits, setUserCredits] = useState(0);
  const [walletAddress, setWalletAddress] = useState<any>(undefined);
  const [isBindWalletAddressModalOpen, setisBindWalletAddressModalOpen] =
    useState(false);
  const [isChangePasswordModalOpen, setisChangePasswordModalOpen] =
    useState(false);
  const [isExChangePointsModalOpen, setisExChangePointsModalOpen] =
    useState(false);
  const [isPurchaseMenberModalOpen, setisPurchaseMenberModalOpen] =
    useState(false);
  const [isPurchaseNodeModalOpen, setisPurchaseNodeModalOpen] = useState(false);
  const [isPurchaseServerModalOpen, setisPurchaseServerModalOpen] =
    useState(false);
  const [purchaseAccountType, setPurchaseAccountType] = useState(1);
  const [loading, setLoading] = useState(false);
  const [payConfig, setPayConfig] = useState<any>({});
  const [userLevelInfo, setUserLevelInfo] = useState<any>({ roleType: -9999 });
  const [messageApi, contextHolder] = message.useMessage();
  const userName = getUserName();
  const handleBingClick = () => {
    setisBindWalletAddressModalOpen(true);
  };
  // 点击兑换按钮
  const handleWithDrawClick = () => {
    updateUserDetail().then(() => {
      setisExChangePointsModalOpen(true);
    });
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
        email: userInfo.email,
        walletAddress: walletAddress,
      }).then((data: any) => {
        const { success } = data;
        if (success) {
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
      email: userInfo.email,
      uuid: getUserId(),
      actionType: '001',
      desc: '用户提现',
      amount: userCredits,
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
  // 选购会员账户确认按钮
  const handlePurchaseAccountModalOk = () => {
    updateSubscriptions({
      email: userInfo.email,
      roleType: 1,
      activeType: Number(purchaseAccountType),
    }).then((res: any) => {
      const { success } = res;
      if (success) {
        message.success('兑换会员成功');
        updateUserDetail();
      } else {
        message.error('兑换会员失败，请联系客服！');
      }
    });
    setisPurchaseMenberModalOpen(false);
  };
  // 选购会员账户取消按钮
  const handlePurchaseAccountModalCancel = () => {
    setisPurchaseMenberModalOpen(false);
  };
  // 选购节点账户确认按钮
  const handlePurchaseNodeModalOk = () => {
    updateSubscriptions({
      email: userInfo.email,
      roleType: 2,
    }).then((res: any) => {
      const { success } = res;
      if (success) {
        message.success('兑换节点成功');
        updateUserDetail();
      } else {
        message.error('兑换节点失败，请联系客服！');
      }
    });
    setisPurchaseNodeModalOpen(false);
  };
  // 选购节点账户取消按钮
  const handlePurchaseNodeModalCancel = () => {
    setisPurchaseNodeModalOpen(false);
  };
  // 选购服务商账户确认按钮
  const handlePurchaseServerModalOk = () => {
    updateSubscriptions({
      email: userInfo.email,
      roleType: 3,
    }).then((res: any) => {
      const { success } = res;
      if (success) {
        message.success('兑换服务商成功');
        updateUserDetail();
      } else {
        message.error('兑换服务商失败，请联系客服！');
      }
    });
    setisPurchaseServerModalOpen(false);
  };
  // 选购服务商账户取消按钮
  const handlePurchaseServerModalCancel = () => {
    setisPurchaseServerModalOpen(false);
  };
  const updateUserDetail = () => {
    return getUserDetail(userName).then((res: any) => {
      // dispatch(loginReducer({ ...data }));
      const { success, data } = res;
      console.log('data', data);
      if (success) {
        setUserInfo(data);
        setUserCredits(data.credits);
        setInviteCode(data.inviteCode);
        setLink(
          `${window.location.href
            .replace('-vip', '')
            .replace('home', '')}register?inviteCode=${data.inviteCode}`
        );
      } else {
        message.error('获取用户信息失败');
      }
    });
  };

  const updatePayConfig = () => {
    getPaymentConfig().then((res: any) => {
      console.log('-data', res);
      const { success, data } = res;
      if (success) {
        setPayConfig(data);
        renderQrCode(data.paymentWalletAddress);
      }
    });
  };

  const renderQrCode = (text: string) => {
    QRCode.toCanvas(qrCodeRef.current, text, function (error: any) {
      if (error) console.error(error);
    });
  };

  useEffect(() => {
    updateUserDetail();
    updatePayConfig();
  }, []);

  useEffect(() => {
    let curItem = { roleType: -999 };
    if (userInfo && userInfo.subscriptions && userInfo.subscriptions.length) {
      userInfo.subscriptions.forEach((item: any) => {
        if (item.roleType > curItem.roleType) {
          curItem = item;
        }
      });
    }
    setUserLevelInfo(curItem);
  }, [userInfo]);

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
                      userInfo.canWithdraw ? (
                        <Button
                          disabled={userInfo.credits === 0}
                          onClick={handleWithDrawClick}
                        >
                          提现
                        </Button>
                      ) : null,
                    ]}
                  >
                    <List.Item.Meta title='账户积分:' />
                    {userInfo.credits + ' 积分'}
                  </List.Item>

                  <List.Item
                    style={{ overflow: 'auto' }}
                    actions={[
                      userLevelInfo.roleType < 1 && (
                        <Button
                          type='primary'
                          onClick={() => {
                            setisPurchaseMenberModalOpen(true);
                          }}
                        >
                          兑换会员
                        </Button>
                      ),
                      userLevelInfo.roleType < 2 && (
                        <Button
                          type='primary'
                          onClick={() => {
                            setisPurchaseNodeModalOpen(true);
                          }}
                        >
                          兑换节点
                        </Button>
                      ),
                      userLevelInfo.roleType < 3 && (
                        <Button
                          type='primary'
                          onClick={() => {
                            setisPurchaseServerModalOpen(true);
                          }}
                        >
                          兑换服务商
                        </Button>
                      ),
                    ]}
                  >
                    <div
                      style={{
                        width: '100%',
                      }}
                    >
                      <List.Item.Meta
                        title='账户类型:'
                        description='账户类型可以通过积分来购买'
                      ></List.Item.Meta>
                      <Tag
                        color={
                          roleTypeList[userLevelInfo.roleType]?.color || ''
                        }
                      >
                        {roleTypeList[userLevelInfo.roleType]?.text}
                      </Tag>
                    </div>
                  </List.Item>
                  <List.Item style={{ overflow: 'auto' }}>
                    <List.Item.Meta
                      title='个人邀请码:'
                      style={{ minWidth: '6em' }}
                    ></List.Item.Meta>
                    <CopyToClipboard
                      text={link}
                      onCopy={() => {
                        messageApi.open({
                          type: 'success',
                          content: '复制成功',
                        });
                      }}
                    >
                      <Button type='dashed' style={{ marginRight: '8px' }}>
                        点击复制邀请链接
                      </Button>
                    </CopyToClipboard>
                    <CopyToClipboard
                      text={inviteCode}
                      onCopy={() => {
                        messageApi.open({
                          type: 'success',
                          content: '复制成功',
                        });
                      }}
                    >
                      <Button type='dashed'>点击复制邀请码</Button>
                    </CopyToClipboard>
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
                    actions={[
                      !userInfo.walletAddress && (
                        <Button type='link' onClick={handleBingClick}>
                          绑定钱包
                        </Button>
                      ),
                    ]}
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
            {/* 充值积分 */}
            <Col span={24}>
              <Card title='充值积分' style={{ height: '100%' }}>
                <div className={styles.canvasWrap}>
                  <div className={styles.moduleWrap}>
                    <Space
                      direction='vertical'
                      size='middle'
                      style={{ width: '100%' }}
                    >
                      <span style={{ fontSize: '20px', fontWeight: 'bolder' }}>
                        平台钱包地址
                      </span>
                      <Row>
                        <Col span={8}>
                          <CopyToClipboard
                            text={payConfig.paymentWalletAddress}
                            onCopy={() => {
                              messageApi.open({
                                type: 'success',
                                content: '复制成功',
                              });
                            }}
                          >
                            <div className={styles.addressContentWrap}>
                              <span>{payConfig.paymentWalletAddress}</span>
                              <CopyOutlined />
                            </div>
                          </CopyToClipboard>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <div>1.请使用波场浏览器或手机钱包进行转账。</div>
                          <div>
                            2.请核对钱包地址后再转账,若转账后没查到充值金额,可联系客服找回。
                          </div>
                          <div style={{ color: 'rgb(38, 161, 123)' }}>
                            3.必须使用账号绑定的钱包地址转账充值才可以正常入账。
                          </div>
                          <div style={{ color: 'rgb(38, 161, 123)' }}>
                            4.转账金额必须大于 1 USDT。
                          </div>
                          <div style={{ color: 'rgb(38, 161, 123)' }}>
                            5.转账后请及时到 「充值记录」 tab
                            栏查询您是否有充值记录。
                          </div>
                        </Col>
                      </Row>
                    </Space>
                  </div>
                  <div className={styles.qrCodeWrap}>
                    <canvas ref={qrCodeRef} className={styles.qrCode}></canvas>
                    <span>平台钱包地址二维码</span>
                  </div>
                </div>
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
        <div>
          兑换积分:
          <InputNumber
            value={Number(userCredits)}
            min={0}
            max={Number(userCredits)}
            step='0.001'
            onChange={(value) => {
              setUserCredits(value as number);
            }}
          />
          积分
        </div>
        <p>积分兑换的钱将稍后转入到钱包。</p>
        <p>有任何问题请联系客服！</p>
      </Modal>
      {/* 购买会员 */}
      <Modal
        title='兑换会员'
        open={isPurchaseMenberModalOpen}
        onOk={handlePurchaseAccountModalOk}
        onCancel={handlePurchaseAccountModalCancel}
        okText='购买'
        cancelText='取消'
      >
        <p>请选择会员的时间</p>
        <div>
          <Radio.Group
            value={purchaseAccountType}
            onChange={(e: any) => {
              setPurchaseAccountType(e.target.value);
            }}
          >
            <Space direction='vertical'>
              <Radio value={1}>季度费用：{payConfig.quarterlyFee} 积分</Radio>
              <Radio value={2}>半年费用：{payConfig.semiAnnualFee} 积分</Radio>
              <Radio value={3}>年度费用：{payConfig.annualFee} 积分</Radio>
            </Space>
          </Radio.Group>
        </div>
      </Modal>
      {/* 购买节点 */}
      <Modal
        title='兑换节点'
        open={isPurchaseNodeModalOpen}
        onOk={handlePurchaseNodeModalOk}
        onCancel={handlePurchaseNodeModalCancel}
        okText='购买'
        cancelText='取消'
      >
        <p>节点:</p>
        <div>年度费用：{payConfig.normalNodeFee} 积分</div>
      </Modal>
      {/* 购买服务商 */}
      <Modal
        title='兑换服务商'
        open={isPurchaseServerModalOpen}
        onOk={handlePurchaseServerModalOk}
        onCancel={handlePurchaseServerModalCancel}
        okText='购买'
        cancelText='取消'
      >
        <p>服务商:</p>
        <div>年度费用：{payConfig.serverNodeFee} 积分</div>
      </Modal>
    </>
  );
}
