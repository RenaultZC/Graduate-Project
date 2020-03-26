import insert from '../../dao/insert';

module.exports = async ctx => {
  const { name, value } = JSON.parse(ctx.request.body);
  const [res] = await insert('snippet', { name, snippet: JSON.stringify(value), time: Date.now() });
  if (res.affectedRows) {
    return ctx.ok({ error: false, msg: '上传成功' });
  }
  return ctx.notFound({ error: true, errMsg: '上传失败' });
};
