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
      <NavTitle title='常见问题' />
      <div className={styles.container}>
        
      </div>
    </>
  )
}
