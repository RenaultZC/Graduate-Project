import insert from '../../dao/insert';
import select from '../../dao/select';
import { decrypt } from '../../common/crypto';

module.exports = async ctx => {
  let { username, email } = ctx.request.body;
  const { password } = ctx.request.body;
  username = decrypt(username);
  email = decrypt(email);
  const [nameRes] = await select('user', { username });
  if (nameRes.length) return ctx.badRequest({ error: true, errCode: 1000 }); // 用户名已存在

  const [emailRes] = await select('user', { email });
  if (emailRes.length) return ctx.badRequest({ error: true, errCode: 1001 }); // 邮箱已存在

  const [res] = await insert('user', { username, password, email, type: 0 });
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '注册成功' });
  }

  return ctx.notFound({ error: true, errCode: 1002 });
};
