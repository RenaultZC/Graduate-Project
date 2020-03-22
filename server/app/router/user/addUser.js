import insert from '../../dao/insert';
import select from '../../dao/select';

module.exports = async ctx => {
  const { username, password, email } = ctx.request.query;

  const [nameRes] = await select('user', { username });
  if (nameRes.length) return ctx.badRequest({ error: true, errCode: 1000 }); // 用户名已存在

  const [emailRes] = await select('user', { email });
  if (emailRes.length) return ctx.badRequest({ error: true, errCode: 1001 }); // 邮箱已存在

  const [res] = await insert('user', { username, password, email, type: 0 });
  if (res.affectedRows) {
    const msg = {
      type: 0,
      username,
      id: res.insertId
    };
    ctx.session = msg;
    return ctx.ok({ error: false, msg });
  }

  return ctx.notFound({ error: true, errCode: 1002 });
};
