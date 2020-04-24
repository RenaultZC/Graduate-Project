import drop from '../../dao/drop';

module.exports = async ctx => {
  const { body } = ctx.request;
  body.id = ctx.session.id;
  console.log(body);
  const [res] = await drop('history', body);
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '删除成功' });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
};
