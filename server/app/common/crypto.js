const crypto = require('crypto');

// 加密
export function aesEncrypt(data, key) {
  const cipher = crypto.createCipher('aes192', key);
  cipher.update(data, 'utf8', 'hex');
  return cipher.final('hex');
}

// 解码
export function aesDecrypt(encrypt, key) {
  const decipher = crypto.createDecipher('aes192', key);
  decipher.update(encrypt, 'hex', 'utf8');
  return decipher.final('utf8');
}
