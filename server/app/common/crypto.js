import CryptoJS from 'crypto-js';

const SECRET_KEY = 'test+123';

export const encrypt = (content = '') => {
  const changeString = string => {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const encryptResult = CryptoJS.AES.encrypt(string, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    const hexStr = encryptResult.ciphertext.toString();

    return hexStr;
  };
  if (typeof content === 'string') {
    return changeString(content);
  }
  Object.keys(content).forEach(v => {
    content[v] = changeString(content[v]);
  });
  return content;
};

export const decrypt = (content = '') => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const bytes = CryptoJS.AES.decrypt(content, key, {
    //iv: key,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    format: CryptoJS.format.Hex
  });
  const decryptResult = bytes.toString(CryptoJS.enc.Utf8);
  return decryptResult.toString();
};
