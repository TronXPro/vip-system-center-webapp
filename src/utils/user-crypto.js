import CryptoJS from 'crypto-js';
import { aesPublicKey } from '../constant';

const publicKey = aesPublicKey;
const secretKey = '123'

// 解密
export function aesDecrypt(content) {
  var bytes  = CryptoJS.AES.decrypt(content, secretKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

// 加密
export function aesEncrypt(content) {
  var ciphertext = CryptoJS.AES.encrypt(content, publicKey).toString();
  return ciphertext;
}








