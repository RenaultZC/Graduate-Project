import restartAnalyze from './restartAnalyze';

module.exports = async ctx => {
  const { snippetId, historyId, headless } = ctx.request.query;
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const runResult = await restartAnalyze({ snippetId, historyId, headless });
  if (runResult) {
    return ctx.ok({
      error: false,
      msg: '执行成功'
    });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
};
