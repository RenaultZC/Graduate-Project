import restartAnalyze from './restartAnalyze';

module.exports = async ctx => {
  const { name, headless, snippet, cronTime, delayTime, email, historyId } = ctx.request.body;
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const runResult = await restartAnalyze({ name, historyId, snippet, delayTime, email, headless, cronTime });
  if (runResult) {
    return ctx.ok({
      error: false,
      msg: '执行成功'
    });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
};
