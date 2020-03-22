import drop from '../../dao/drop';
import { USER_TYPE } from '../../config/common';

module.exports = async ctx => {
  if (ctx.session.type !== USER_TYPE.ADMIN)
    return ctx.unauthorized({ error: true, errCode: 1006 });
  const { query } = ctx.request;
  const [res] = await drop('user', query);
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '删除成功' });
  }
  return ctx.badRequest({ error: true, errCode: 1007 });
};
