const nodemailer = require('nodemailer');
const config = require('../config/db');


const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: config.email
});

const sendEmail = (email, id, name) => {
  const link = `http://localhost:3000/history/${id}`;
  const title = `已经运行完毕${name}`;
  const mailOptions = {
    from: '1073294992@qq.com',
    to: email,
    subject: title, //标题
    html: `<h2>${title},<a href="${link}">点击该链接</a>查看运行结果</h2>`
  };
  transporter.sendMail(mailOptions, err => {
    if (err) {
      console.log('邮件发送失败', err);
    }
    transporter.close();
  });
};
module.exports = sendEmail;
