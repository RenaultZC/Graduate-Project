import drop from '../../dao/drop';
import { USER_TYPE } from '../../config/common';

module.exports = async ctx => {
  if (ctx.session.type === USER_TYPE.ADMIN)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const { query } = ctx.request;
  const [res] = await drop('snippet', query);
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '删除成功' });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
};
