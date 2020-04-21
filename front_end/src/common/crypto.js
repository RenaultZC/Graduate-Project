import CryptoJS from 'crypto-js';

const SECRET_KEY = 'test+123';

export const encrypt = (content='') => {
  const changeString = string => {
    var key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    var encryptResult = CryptoJS.AES.encrypt(string, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    var hexStr = encryptResult.ciphertext.toString();

    return hexStr;
  }
  if (typeof content === 'string') {
    return changeString(content);
  }
  Object.keys(content).forEach(v => {
    content[v] = changeString(content[v]);
  });
  return content;
};

export const decrypt = (content='') => {
  var key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  var bytes = CryptoJS.AES.decrypt(content, key, {
    //iv: key,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    format: CryptoJS.format.Hex
  });
  var decryptResult = bytes.toString(CryptoJS.enc.Utf8);
  return decryptResult.toString();
};