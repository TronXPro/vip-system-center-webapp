import React from 'react'
import { Anchor, Col, Divider, Row, Table, Typography } from 'antd'
import styles from './Help.module.less'
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useMediaQuery from '../hooks/useMediaQuery';
import NavTitle from '../components/NavTitle';

const { Title, Paragraph } =  Typography;

export default function Help() {
  const isMobile = useMediaQuery("(max-width: 750px)");
  const dataSource = [{
    codeNum: '200',
    description: '下单成功',
    suggest: '返回的data对象包含: 下单成功的订单ID、 下单后账户余额、 订单消费金额'
  },{
    codeNum: '400',
    description: 'body参数不完整',
    suggest: '请仔细核对文档和实际请求的参数类型和值是否合理有效'
  },{
    codeNum: '401',
    description: '当前资源仅支持(ENERGY)能量',
    suggest: "检查参数 resource: 'ENERGY'"
  },{
    codeNum: '402',
    description: '该api用户不存在或token不存在',
    suggest: '请在API密钥模块复制最新的_id 和TOKEN'
  },{
    codeNum: '403',
    description: '该api用户已被禁用',
    suggest: '请联系电报管理员'
  },{
    codeNum: '404',
    description: 'duration 不在范围',
    suggest: 'duration字段可选值：一个小时: 0.1 一天: 1  三天: 3 七天: 7 十天: 10'
  },{
    codeNum: '405',
    description: '接收地址不合法',
    suggest: '检查接收地址是不是波场地址'
  },{
    codeNum: '406',
    description: '系统内部错误',
    suggest: '通常是业务发生变化，或不能操作，可放弃或重试'
  },{
    codeNum: '407',
    description: '余额不足',
    suggest: '请到首页模块去充值'
  },{
    codeNum: '408',
    description: '资源数量不在限制范围',
    suggest: '下单能量数量最小：32000、下单能量数量最大：1000000000'
  },{
    codeNum: '409',
    description: '平台能量余量不足',
    suggest: '下单前可以查询平台能量数量，等能量恢复后再下单'
  }]
  const columns = [{
    title: '状态码',
    dataIndex: 'codeNum',
    key:'codeNum'
  },{
    title: '说明',
    dataIndex: 'description',
    key:'codeNum'
  },{
    title: '建议',
    dataIndex: 'suggest',
    key:'suggest'
  }]
  return (
    <>
      <NavTitle title='帮助文档' />
      <div className={styles.container}>
        <Row>
          <Col span={isMobile ? 24 : 20}>
            <div className={styles.content}>
                <Typography>
                  <Title level={3} id='using-tutorial'>使用教程</Title>
                  <Paragraph>
                    <div>1.调用查询账户的接口，检查自己的余额是否充足，检查当前最大下单数量</div>
                    <div>2.调用查询下单参数接口，检查平台的能量剩余数量，获取不同时间段的单价</div>
                    <div>3.调用租用资源下单接口，参考平台剩余能量数量、个人账户余额、当前最大的下单数量，填写能量接收地址</div>
                  </Paragraph>
                  <Divider />
                  <Title level={3}>API文档</Title>
                  <Title level={4} id='get-user-detail'>1. 查询账户</Title>
                  <Title level={5}>请求链接</Title>
                  <SyntaxHighlighter children={'POST  https://api.diditron.net/api/open/get-user-detail'} language="javascript" style={a11yDark} />
                  <Title level={5}>请求参数示例</Title> 
                  <SyntaxHighlighter children={
        `{
    "_id": '6533a4458aa676310fe6364c' // 用户身份认证ID，在API密钥模块可以查看
  }`
                } language="javascript" style={a11yDark} />
                <Title level={5}>响应参数示例</Title> 
                  <SyntaxHighlighter children={
        `{
    "data": {
        "balance": 0, // 当前账户余额
        "walletAddress": "TUG8cpYXqZXdfTMnFVvvy9CNj6TYXVUSDY", // 当前账户绑定的地址 
        "_id": "6533a4458aa676310fe6364123c", // 用户的认证id
        "username": "test@qq.com", // 用户注册的名字
        "token": "fe31231231a1d0c2f6ee3088cb88ff39bf8a1b" // API的密钥
    },
    "message": "成功",
    "status": 200
  }`
                } language="javascript" style={a11yDark} />
                <Divider />
                <Title level={4} id="payConfig">2. 查询下单参数</Title>
                <Title level={5}>请求链接</Title>
                <SyntaxHighlighter children={'POST  https://api.diditron.net/api/open/payConfig'} language="javascript" style={a11yDark} />
                <Title level={5}>请求参数示例</Title>
                <SyntaxHighlighter children={
        `{
    "_id": '6533a4458aa676310fe6364c' // 用户身份认证ID，在API密钥模块可以查看
  }`
                } language="javascript" style={a11yDark} />
                <Title level={5}>响应参数示例</Title> 
                  <SyntaxHighlighter children={
        `{
    "data": {
        "payConfig": {
          "limit": {
            "min": 32000 // 最小下单数量
            "max": 10000000 // 最大下单数量
          },
          "priceConfig": {
            "0.1": 70 // 租用1小时费用 70 SUN（此处价格用作举例，实际价格以当天的为准）
            "1": 90 // 租用一天费用 90 SUN（此处价格用作举例，实际价格以当天的为准）
            "3": 40 // 租用时间3天的单天费用 40 SUN（此处价格用作举例，实际价格以当天的为准）
            "7": 50 // 租用时间3天的单天费用 50 SUN（此处价格用作举例，实际价格以当天的为准）
            "10": 50 // 租用时间3天的单天费用 50 SUN（此处价格用作举例，实际价格以当天的为准）
          },
          "availableEnergy": 5678172189219 // 剩余可租能量
        },
        "userInfo": {
          "username": "test" // 用户名
          "state": 0 // 用户状态，0：正常，1：禁用
          "balance": 1 // 用户余额，单位TRX
        }
    },
    "message": "成功",
    "status": 200
  }`
                } language="javascript" style={a11yDark} />
                  <Divider />
                  <Title level={4} id='freeze-order'>3. 租用资源下单</Title>
                  <Title level={5}>请求链接</Title>
                  <SyntaxHighlighter children={'POST  https://api.diditron.net/api/open/freeze-order'} language="javascript" style={a11yDark} />
                  <Title level={5}>请求参数示例</Title> 
                  <SyntaxHighlighter children={
        `{
    "_id": '6533a4458aa676310fe6364c', // 用户身份认证ID，在API密钥模块可以查看
    "token": 'fe31a1d0c2f6ee3088cb88ff39bf8a212b', // API 密钥
    "resource": 'ENERGY', // 资源类型
    "receiverAddress": 'TUG8cpYXqZXdfTMnFVvvy9CNj6TYXVasSDY', // 资源接收的地址
    "resourceValue": 32000, // 租用数量
    "duration": 0.1 // 一个小时: 0.1 一天: 1  三天: 3 七天: 7 十天: 10
  }`
                } language="javascript" style={a11yDark} />
                <Title level={5}>响应参数示例</Title> 
                  <SyntaxHighlighter children={
        `{
    "data": {
      "orderId":2023081949511021 // 下单成功的订单ID
      "balance":1 // 下单后账户余额，单位SUN
      "orderMoney":2.17 // 该订单消费金额，单位TRX
    }
    "message": "下单成功", // 下单成功 或者 下单失败
    "status": 200
  }`
                } language="javascript" style={a11yDark} />
                  <Title level={5}>接口状态码（仅下单接口）</Title> 
                  <Table dataSource={dataSource} columns={columns} pagination={false} />
                  <Divider />
                  <Title level={4} id='get-order-detail'>4.获取订单信息</Title>
                  <Title level={5}>请求链接</Title>
                  <SyntaxHighlighter children={'POST  https://api.diditron.net/api/open/get-order-detail'} language="javascript" style={a11yDark} />
                  <Title level={5}>请求参数示例</Title> 
                  <SyntaxHighlighter children={
        `{
    "_id": '6533a4458aa676310fe6364c' // 用户身份认证ID，在API密钥模块可以查看
    "orderId":2023081949511021 // 订单ID
  }`
                } language="javascript" style={a11yDark} />
                <Title level={5}>响应参数示例</Title> 
                  <SyntaxHighlighter children={
        `{
    "data": {
      "orderId":2023081949511021 // 订单ID
      "resource": 'ENERGY', // 资源类型
      "receiverAddress": 'TUG8cpYXqZXdfTMnFVvvy9CNj6TYXVasSDY', // 资源接收的地址
      "resourceValue": 32000, // 租用数量
      "duration": 0.1 // 一个小时: 0.1 一天: 1  三天: 3 七天: 7 十天: 10
      "state": 0 // 订单状态: 未完成: 0 进行中: 5 已完成: 1
      "detail": [ // 资源代理交易列表
        {
          "hash": "9444046b9c89c240ccfdc05ca2a0ba67fc722ae701a29fa16cffd2ae1733e7eb" // 资源代理交易Hash
          "resNums":32000 // 资源代理数量
          "sendAddress":"TPCyf6FpGqwRKxQQHo4Ykc97XeENaz2FnQ" // 发送资源地址
          "recoveryTime":"2023-09-09 14:36:30" // 资源回收时间
        }
      ]
    },
    "message": "成功",
    "status": 200
  }`
                } language="javascript" style={a11yDark} />
                </Typography>
            </div>
          </Col>
          { !isMobile &&  <Col span={4}>
            <div className={styles.anchorWrap}>
              <Anchor
                items={[
                  {
                    key: 'using-tutorial',
                    href: '#using-tutorial',
                    title: '使用教程',
                  },
                  {
                    key: 'get-user-detail',
                    href: '#get-user-detail',
                    title: '1.查询账户',
                  },
                  {
                    key: 'payConfig',
                    href: '#payConfig',
                    title: '2.查询下单参数',
                  },
                  {
                    key: 'freeze-order',
                    href: '#freeze-order',
                    title: '3.租用资源下单',
                  },
                  {
                    key: 'get-order-detail',
                    href: '#get-order-detail',
                    title: '4.获取订单信息',
                  }
                ]}
              />
            </div>
          </Col>} 
        </Row>
      </div>
    </>
  )
}
