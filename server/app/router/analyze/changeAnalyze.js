import update from '../../dao/update';
import { USER_TYPE } from '../../config/common';

module.exports = async ctx => {
  if (ctx.session.type !== USER_TYPE.ADMIN)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const { body } = ctx.request;
  const [res] = await update('snippet', body);
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '修改成功' });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
};
