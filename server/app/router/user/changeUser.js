import update from '../../dao/update';
import { USER_TYPE } from '../../config/common';
import { decrypt } from '../../common/crypto';

module.exports = async ctx => {
  const { search, value } = ctx.request.body;
  if (ctx.session.type !== USER_TYPE.ADMIN && ctx.session.id !== search.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const username = decrypt(value.username);
  const email = decrypt(value.email);
  const { password, avatar, type } = value;
  let newValue = {};
  if (username) newValue = Object.assign(newValue, { username });
  if (password) newValue = Object.assign(newValue, { password });
  if (email) newValue = Object.assign(newValue, { email });
  if (type) newValue = Object.assign(newValue, { type });
  if (avatar) newValue = Object.assign(newValue, { avatar });
  const [res] = await update('user', { search, value: newValue });
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '信息修改成功' });
  }

  return ctx.notFound({ error: true, errCode: 1005 });
};
