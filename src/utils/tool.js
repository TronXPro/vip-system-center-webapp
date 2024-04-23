// 换算sun为trx
export function scalerSunToTrx(val:any) {
  return val / 1000000
}
// 转日期
export function translateRentTime(text) {
  // 一个小时: 0.1 一天: 1  三天: 3 七天: 7 十天: 10
  let timeList = {
    0.1: '一小时',
    1: '一天',
    3: '三天',
    7: '七天',
    10: '十天'
  }
  if(timeList[text]) {
    return timeList[text];
  } else {
    return text;
  }
}







