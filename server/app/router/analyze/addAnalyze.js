import insert from '../../dao/insert';

module.exports = async ctx => {
  const { params } = ctx.requst.body;
  const [res] = await insert('snippet', params);
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '上传成功' });
  }
  return ctx.notFound({ error: true, errMsg: '上传失败' });
};
