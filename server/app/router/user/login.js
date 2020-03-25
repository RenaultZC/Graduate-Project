import select from '../../dao/select';
import { decrypt } from '../../common/crypto';

module.exports = async ctx => {
  const { username, password } = ctx.request.body;
  if (ctx.session.id) return ctx.ok({ error: false, msg: ctx.session });
  if (!(username && password)) return ctx.unauthorized({ error: true, errCode: 1008 });
  const user = decrypt(username);
  let [res] = await select('user', { username: user });

  if (!res.length) { [res] = await select('user', { email: user }); }

  if (res.length) {
    res = res[0];
    const pass = res.password;
    if (pass === password) {
      const msg = {
        type: res.type,
        username: res.username,
        id: res.id,
        avatar: res.avatar
      };
      ctx.session = msg;
      return ctx.ok({ error: false, msg });
    }
  }

  return ctx.unauthorized({ error: true, errCode: 1008 });
};
