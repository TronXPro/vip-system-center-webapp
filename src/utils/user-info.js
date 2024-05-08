/**
 * 存储/获取 user id
 */

const KEY = 'uuid';
const USER_NAME_KEY = 'accountName';
const USER_TOKEN_KEY = 'token';
// 设置用户ID
export function setUserId(value) {
  const item = {
    value: value,
    expiration: new Date().getTime() + 1 * 60 * 60 * 1000, // 过期时间
  };
  localStorage.setItem(KEY, JSON.stringify(item));
}
// 获取用户的ID
export function getUserId() {
  try {
    const item = JSON.parse(localStorage.getItem(KEY));
    if (item && new Date().getTime() < item.expiration) {
      return item.value;
    } else {
      setUserLoginOut();
    }
  } catch (error) {
    setUserLoginOut();
  }
}
// 移除用户的ID
export function removeUserId() {
  localStorage.removeItem(KEY);
}

// 设置用户名字
export function setUserName(value) {
  localStorage.setItem(USER_NAME_KEY, value);
}
// 获取用户名
export function getUserName() {
  return localStorage.getItem(USER_NAME_KEY);
}
// 移除用户的名字
export function removeUserName() {
  localStorage.removeItem(USER_NAME_KEY);
}

// 设置用户Token
export function setUserToken(value) {
  console.log('USER_TOKEN_KEY', value);
  return localStorage.setItem(USER_TOKEN_KEY, value);
}
// 获取用户的Token
export function getUserToken() {
  return localStorage.getItem(USER_TOKEN_KEY);
}
// 移除用户Token
export function removeUserToken() {
  return localStorage.removeItem(USER_TOKEN_KEY);
}

// 退出登录
export function setUserLoginOut() {
  removeUserId();
  removeUserName();
  removeUserToken();
  // eslint-disable-next-line no-restricted-globals
  location.href = '/login';
}
