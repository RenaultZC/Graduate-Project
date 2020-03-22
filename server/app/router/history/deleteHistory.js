import drop from '../../dao/drop';

module.exports = async ctx => {
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const [res] = await drop();
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '刪除运行成功' });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
};
