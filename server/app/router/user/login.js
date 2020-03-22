import select from '../../dao/select';
import { aesDecrypt } from '../../common/crypto';
import { SECRET_KEY } from '../../config/common';

module.exports = async ctx => {
  const { username, password } = ctx.request.query;
  if (ctx.session.id) return ctx.ok({ error: false, msg: ctx.session });
  const user = aesDecrypt(username, SECRET_KEY);
  let [res] = await select('user', { username: user });

  if (!res.length) { [res] = await select('user', { email: user }); }

  if (res.length) {
    res = res[0];
    const pass = res.password;
    if (pass === password) {
      const msg = {
        type: res.type,
        username: res.username,
        id: res.id
      };
      ctx.session = msg;
      return ctx.ok({ error: false, msg });
    }
  }

  return ctx.unauthorized({ error: true, errCode: 1008 });
};
