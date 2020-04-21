import update from '../../dao/update';
import { USER_TYPE } from '../../config/common';
import { decrypt } from '../../common/crypto';

module.exports = async ctx => {
  const { search, value } = ctx.request.body;
  if (ctx.session.type !== USER_TYPE.ADMIN)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const username = decrypt(value.username);
  const email = decrypt(value.email);
  const password = decrypt(value.password);

  const [res] = await update('user', { search, value: { username, email, password } });
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '信息修改成功' });
  }

  return ctx.notFound({ error: true, errCode: 1005 });
};
