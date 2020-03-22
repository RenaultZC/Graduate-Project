import update from '../../dao/update';
import { USER_TYPE } from '../../config/common';

module.exports = async ctx => {
  const { params, id } = ctx.request.query;
  if (ctx.session.id !== id && ctx.session.type !== USER_TYPE.ADMIN)
    return ctx.unauthorized({ error: true, errCode: 1003 });

  const [res] = await update('user', params);
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '信息修改成功' });
  }

  return ctx.notFound({ error: true, errCode: 1005 });
};
